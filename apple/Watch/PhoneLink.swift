import Combine
import Foundation
import WatchConnectivity

/// A favourite sent from the iPhone app.
struct Favourite: Codable, Identifiable, Hashable {
    let id: String
    let label: String
    let spoken: String
    let emoji: String
    let colour: UInt32
}

/// Receives Favourites from the iPhone app over the Bluetooth link between the two, and keeps them on the watch.
/// Nothing goes the other way, and nothing uses the internet.
final class PhoneLink: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = PhoneLink()

    private static let storageKey = "favourites"

    @Published private(set) var favourites: [Favourite] = []

    override private init() {
        super.init()
        if let data = UserDefaults.standard.data(forKey: Self.storageKey),
           let saved = try? JSONDecoder().decode([Favourite].self, from: data) {
            favourites = saved
        }
    }

    func start() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    private func receive(_ context: [String: Any]) {
        guard let raw = context["favourites"] as? [[String: Any]] else { return }
        let received: [Favourite] = raw.prefix(30).compactMap { entry in
            guard let id = entry["id"] as? String,
                  let label = entry["label"] as? String, !label.isEmpty,
                  let spoken = entry["spoken"] as? String else { return nil }
            let colour = (entry["colour"] as? NSNumber)?.uint32Value ?? 0xFEF08A
            return Favourite(id: id, label: String(label.prefix(40)), spoken: String(spoken.prefix(200)),
                             emoji: String((entry["emoji"] as? String ?? "").prefix(8)), colour: colour)
        }
        DispatchQueue.main.async {
            self.favourites = received
            if let data = try? JSONEncoder().encode(received) {
                UserDefaults.standard.set(data, forKey: Self.storageKey)
            }
        }
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if activationState == .activated { receive(session.receivedApplicationContext) }
    }

    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        receive(applicationContext)
    }
}
