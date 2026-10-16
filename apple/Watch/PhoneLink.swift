import Combine
import Foundation
import WatchConnectivity

/// The link to the iPhone app over the Bluetooth between a watch and the iPhone it is paired with. Nothing uses the
/// internet. Things come from the iPhone only if an adult turned the link on in Parent Mode; what the watch can ask
/// the iPhone is to open an ordinary page or change the traffic light, and never to speak.
final class PhoneLink: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = PhoneLink()

    private static let storageKey = "linkState"

    @Published private(set) var state = LinkState.empty
    @Published private(set) var reachable = false
    /// What happened to the last thing asked of the iPhone, in words.
    @Published var result: String?

    var favourites: [Favourite] { state.favourites }

    override private init() {
        super.init()
        if let json = UserDefaults.standard.string(forKey: Self.storageKey), let saved = LinkState.decode(json) {
            state = saved
        }
    }

    func start() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    private func receive(_ context: [String: Any]) {
        guard let json = context["state"] as? String, let received = LinkState.decode(json) else { return }
        DispatchQueue.main.async {
            self.state = received
            UserDefaults.standard.set(json, forKey: Self.storageKey)
        }
    }

    /// Asks the iPhone to do something, and says in words how that went.
    func ask(_ json: String, done: String) {
        let session = WCSession.default
        guard session.activationState == .activated, session.isReachable else {
            result = "Open Rugged Speech on the iPhone first, and turn the link on in Parent Mode."
            return
        }
        session.sendMessage(["json": json], replyHandler: { _ in
            DispatchQueue.main.async { self.result = done }
        }, errorHandler: { _ in
            DispatchQueue.main.async { self.result = "The iPhone did not answer. Is the link on in Parent Mode?" }
        })
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async { self.reachable = session.isReachable }
        if activationState == .activated { receive(session.receivedApplicationContext) }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async { self.reachable = session.isReachable }
    }

    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        receive(applicationContext)
    }
}
