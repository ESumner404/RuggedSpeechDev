import SwiftUI

/// Rugged Speech on Apple Watch: the few things a child needs in one press, spoken from the watch.
/// Works on its own with no iPhone and no internet. Favourites can arrive from the iPhone app over
/// the Bluetooth link between the two, only if an adult turned that on there.
@main
struct RuggedSpeechWatchApp: App {
    init() {
        PhoneLink.shared.start()
    }

    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}
