import Combine
import Foundation
import MultipeerConnectivity

/// The link to the family's own iPad or iPhone, over the home network. It never uses the internet.
///
/// The television shows a four-digit code. An adult types it into Parent Mode on the iPad, which turns the link on and
/// will let in only a television that gives that code. Once connected, the television can show the iPad's Favourites,
/// today's plan and traffic light, and ask it to open an ordinary page such as Games or Draw. It can never make the iPad speak.
final class IPadLink: NSObject, ObservableObject, MCNearbyServiceBrowserDelegate, MCSessionDelegate {
    static let shared = IPadLink()

    private static let serviceType = "rugged-link"
    private static let codeKey = "linkCode"

    enum Status: Equatable {
        case searching
        case connected(name: String)
    }

    @Published private(set) var status = Status.searching
    @Published private(set) var state = LinkState.empty
    /// The code an adult types in on the iPad.
    @Published private(set) var code: String

    private let peerID = MCPeerID(displayName: "Apple TV")
    private var session: MCSession!
    private var browser: MCNearbyServiceBrowser!
    private var inviting = Set<MCPeerID>()

    override private init() {
        let saved = UserDefaults.standard.string(forKey: Self.codeKey)
        code = saved ?? Self.newCode()
        super.init()
        UserDefaults.standard.set(code, forKey: Self.codeKey)
        session = MCSession(peer: peerID, securityIdentity: nil, encryptionPreference: .required)
        session.delegate = self
        browser = MCNearbyServiceBrowser(peer: peerID, serviceType: Self.serviceType)
        browser.delegate = self
    }

    private static func newCode() -> String {
        String(format: "%04d", Int.random(in: 0...9999))
    }

    func start() {
        browser.startBrowsingForPeers()
    }

    /// Chooses a new code, for when the old one has been seen by someone who should not have it.
    func changeCode() {
        code = Self.newCode()
        UserDefaults.standard.set(code, forKey: Self.codeKey)
        session.disconnect()
        inviting.removeAll()
        DispatchQueue.main.async { self.status = .searching }
    }

    /// Asks the iPad to do something. Only ordinary pages and the traffic light can be asked for.
    func send(_ json: String) {
        guard let data = json.data(using: .utf8), !session.connectedPeers.isEmpty else { return }
        try? session.send(data, toPeers: session.connectedPeers, with: .reliable)
    }

    var isConnected: Bool {
        if case .connected = status { return true }
        return false
    }

    // MARK: Finding the iPad

    func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String: String]?) {
        guard !inviting.contains(peerID), !session.connectedPeers.contains(peerID) else { return }
        inviting.insert(peerID)
        browser.invitePeer(peerID, to: session, withContext: code.data(using: .utf8), timeout: 30)
    }

    func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        inviting.remove(peerID)
    }

    func browser(_ browser: MCNearbyServiceBrowser, didNotStartBrowsingForPeers error: Error) {}

    // MARK: The connection

    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        DispatchQueue.main.async {
            switch state {
            case .connected:
                self.status = .connected(name: peerID.displayName)
            case .notConnected:
                self.inviting.remove(peerID)
                if session.connectedPeers.isEmpty { self.status = .searching }
                // Ask again, so the link comes back by itself after the iPad sleeps or the wifi drops.
                self.browser.stopBrowsingForPeers()
                self.browser.startBrowsingForPeers()
            default:
                break
            }
        }
    }

    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        guard data.count <= 64 * 1024, let json = String(data: data, encoding: .utf8), let received = LinkState.decode(json) else { return }
        DispatchQueue.main.async { self.state = received }
    }

    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
}
