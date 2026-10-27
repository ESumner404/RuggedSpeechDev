import Foundation
import MultipeerConnectivity
import UIKit
import WatchConnectivity

/// The link to the family's own Apple Watch and Apple TV. It only runs while an adult has turned it on in Parent Mode.
///
/// - The watch is reached with WatchConnectivity, which is Bluetooth between a watch and the iPhone it is paired with.
/// - The television is reached with MultipeerConnectivity on the home network, never the internet. It is let in only if
///   it gives the four-digit code the adult typed in, and the connection is encrypted.
///
/// Messages are small pieces of JSON text. The page decides what they mean; this class only carries them.
final class AppleLink: NSObject, MCNearbyServiceAdvertiserDelegate, MCSessionDelegate, WCSessionDelegate {
    static let shared = AppleLink()

    private static let serviceType = "rugged-link"
    private static let maxMessageBytes = 256 * 1024
    /// The watch only ever gets the small `state` message, never the boards.
    private static let maxWatchBytes = 64 * 1024
    private static let maxInbox = 50
    private static let maxWrongCodes = 5

    private let peerID = MCPeerID(displayName: UIDevice.current.name)
    private var session: MCSession?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var code = ""
    private var wrongCodes = 0
    /// The latest message of each kind, sent again to a device that has just connected.
    private var lastByType: [String: String] = [:]

    private let lock = NSLock()
    private var inbox: [String] = []

    // MARK: Turning it on and off

    func start(code: String) {
        stop()
        guard code.range(of: "^[0-9]{4}$", options: .regularExpression) != nil else { return }
        lock.lock(); self.code = code; wrongCodes = 0; lock.unlock()

        let session = MCSession(peer: peerID, securityIdentity: nil, encryptionPreference: .required)
        session.delegate = self
        self.session = session
        let advertiser = MCNearbyServiceAdvertiser(peer: peerID, discoveryInfo: nil, serviceType: Self.serviceType)
        advertiser.delegate = self
        advertiser.startAdvertisingPeer()
        self.advertiser = advertiser

        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }

    func stop() {
        advertiser?.stopAdvertisingPeer()
        advertiser = nil
        session?.disconnect()
        session = nil
        lock.lock(); code = ""; inbox.removeAll(); lastByType.removeAll(); lock.unlock()
    }

    // MARK: Sending and receiving

    func send(_ json: String) {
        guard json.utf8.count <= Self.maxMessageBytes else { return }
        let type = Self.type(of: json)
        lock.lock(); lastByType[type] = json; lock.unlock()
        push(json, type: type)
    }

    /// The kind of message, read from the start of its JSON (`{"type":"state",...`).
    private static func type(of json: String) -> String {
        guard let range = json.range(of: "^\\{\"type\":\"[A-Za-z-]{1,30}\"", options: .regularExpression) else { return "other" }
        return String(json[range].dropFirst(9).dropLast(1))
    }

    private func push(_ json: String, type: String) {
        if let session = session, !session.connectedPeers.isEmpty, let data = json.data(using: .utf8) {
            try? session.send(data, toPeers: session.connectedPeers, with: .reliable)
        }
        // Only the small state goes to the watch: it has no use for the boards, and a limit on how much it can take.
        if type == "state", json.utf8.count <= Self.maxWatchBytes, WCSession.isSupported() {
            let watch = WCSession.default
            if watch.activationState == .activated, watch.isPaired, watch.isWatchAppInstalled {
                try? watch.updateApplicationContext(["state": json])
            }
        }
    }

    /// What has arrived since the last call, and how many devices are connected.
    func takeInbox() -> (messages: [String], peers: Int) {
        lock.lock()
        let messages = inbox
        inbox.removeAll()
        lock.unlock()
        var peers = session?.connectedPeers.count ?? 0
        if WCSession.isSupported(), WCSession.default.activationState == .activated, WCSession.default.isReachable { peers += 1 }
        return (messages, peers)
    }

    private func receive(_ data: Data) {
        guard data.count <= Self.maxMessageBytes, let text = String(data: data, encoding: .utf8) else { return }
        receive(text)
    }

    private func receive(_ text: String) {
        guard text.utf8.count <= Self.maxMessageBytes else { return }
        lock.lock()
        if inbox.count < Self.maxInbox { inbox.append(text) }
        lock.unlock()
    }

    // MARK: A television asking to join

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID,
                    withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        lock.lock()
        let expected = code
        let tooMany = wrongCodes >= Self.maxWrongCodes
        let given = context.flatMap { String(data: $0, encoding: .utf8) } ?? ""
        let accepted = !tooMany && !expected.isEmpty && given == expected
        if !accepted && !tooMany { wrongCodes += 1 }
        lock.unlock()
        invitationHandler(accepted, accepted ? session : nil)
    }

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didNotStartAdvertisingPeer error: Error) {}

    // MARK: Connected television

    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        guard state == .connected else { return }
        lock.lock(); let all = Array(lastByType.values); lock.unlock()
        for json in all {
            if let data = json.data(using: .utf8) { try? session.send(data, toPeers: [peerID], with: .reliable) }
        }
    }

    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) { receive(data) }
    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}

    // MARK: Paired watch

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        lock.lock(); let json = lastByType["state"]; lock.unlock()
        if activationState == .activated, let json = json { push(json, type: "state") }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) { session.activate() }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
        if let json = message["json"] as? String { receive(json) }
        replyHandler(["ok": true])
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        if let json = message["json"] as? String { receive(json) }
    }
}
