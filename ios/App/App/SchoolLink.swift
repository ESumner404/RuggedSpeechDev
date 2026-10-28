import Foundation
import MultipeerConnectivity
import UIKit

/// How a school hands a pack to many pupils' devices over its own wifi, one way.
///
/// The school's device (the sender) finds nearby devices that are listening and sends them the pack. A pupil's device
/// (the listener) lets in only a sender that gives the school's code, and receives. Nothing ever travels from a pupil's
/// device back to the school's, there is no internet, and a received pack only waits: an adult on the pupil's device looks
/// at it and chooses whether to add it.
final class SchoolLink: NSObject, MCNearbyServiceAdvertiserDelegate, MCNearbyServiceBrowserDelegate, MCSessionDelegate {
    static let shared = SchoolLink()

    private static let serviceType = "rugged-school"
    private static let maxBytes = 26_000_000
    private static let maxWrongCodes = 5

    private let peerID = MCPeerID(displayName: UIDevice.current.name)
    private var session: MCSession?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var browser: MCNearbyServiceBrowser?
    private var role = ""
    private var code = ""
    private var wrongCodes = 0
    private var inviting = Set<MCPeerID>()

    private let lock = NSLock()
    private var inbox: [String] = []

    func start(role: String, code: String) {
        stop()
        guard code.range(of: "^[0-9]{4}$", options: .regularExpression) != nil, role == "sender" || role == "listener" else { return }
        lock.lock(); self.role = role; self.code = code; wrongCodes = 0; lock.unlock()
        let session = MCSession(peer: peerID, securityIdentity: nil, encryptionPreference: .required)
        session.delegate = self
        self.session = session
        if role == "sender" {
            let browser = MCNearbyServiceBrowser(peer: peerID, serviceType: Self.serviceType)
            browser.delegate = self
            browser.startBrowsingForPeers()
            self.browser = browser
        } else {
            let advertiser = MCNearbyServiceAdvertiser(peer: peerID, discoveryInfo: nil, serviceType: Self.serviceType)
            advertiser.delegate = self
            advertiser.startAdvertisingPeer()
            self.advertiser = advertiser
        }
    }

    func stop() {
        browser?.stopBrowsingForPeers(); browser = nil
        advertiser?.stopAdvertisingPeer(); advertiser = nil
        session?.disconnect(); session = nil
        inviting.removeAll()
        lock.lock(); role = ""; code = ""; inbox.removeAll(); lock.unlock()
    }

    /// Sends a pack to every connected listener. Only the sender may.
    func send(_ json: String) -> Int {
        guard role == "sender", json.utf8.count <= Self.maxBytes, let session = session, !session.connectedPeers.isEmpty,
              let data = json.data(using: .utf8) else { return 0 }
        try? session.send(data, toPeers: session.connectedPeers, with: .reliable)
        return session.connectedPeers.count
    }

    func takeInbox() -> (messages: [String], peers: Int) {
        lock.lock(); let messages = inbox; inbox.removeAll(); lock.unlock()
        return (messages, session?.connectedPeers.count ?? 0)
    }

    // MARK: Sender: finding listeners

    func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String: String]?) {
        guard let session = session, !inviting.contains(peerID), !session.connectedPeers.contains(peerID) else { return }
        inviting.insert(peerID)
        browser.invitePeer(peerID, to: session, withContext: code.data(using: .utf8), timeout: 30)
    }

    func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) { inviting.remove(peerID) }
    func browser(_ browser: MCNearbyServiceBrowser, didNotStartBrowsingForPeers error: Error) {}

    // MARK: Listener: letting a sender in

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID,
                    withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        lock.lock()
        let tooMany = wrongCodes >= Self.maxWrongCodes
        let given = context.flatMap { String(data: $0, encoding: .utf8) } ?? ""
        let accepted = !tooMany && !code.isEmpty && given == code
        if !accepted && !tooMany { wrongCodes += 1 }
        lock.unlock()
        invitationHandler(accepted, accepted ? session : nil)
    }

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didNotStartAdvertisingPeer error: Error) {}

    // MARK: Session

    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        if state == .notConnected { inviting.remove(peerID) }
    }

    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        // Only a listener takes anything in, and only text that is a sensible size.
        guard role == "listener", data.count <= Self.maxBytes, let text = String(data: data, encoding: .utf8) else { return }
        lock.lock(); if inbox.count < 5 { inbox.append(text) }; lock.unlock()
    }

    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
}
