import SwiftUI

/// Rugged Speech on Apple TV: the words on a big screen, pressed with the Siri Remote, spoken through the television.
/// Works with no internet. Nothing is sent anywhere and nothing is kept except the voice speed.
@main
struct RuggedSpeechTVApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}
