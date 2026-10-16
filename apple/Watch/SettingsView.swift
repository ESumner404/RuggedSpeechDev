import SwiftUI

struct SettingsView: View {
    @AppStorage(SpeechSpeed.storageKey) private var speed = SpeechSpeed.usual.rawValue

    var body: some View {
        List {
            Picker("Voice speed", selection: $speed) {
                ForEach(SpeechSpeed.allCases) { choice in
                    Text(choice.title).tag(choice.rawValue)
                }
            }
            Button("Hear the voice") {
                Speaker.shared.speak("This is what I sound like.")
            }
            Text("Works with no internet. Words stay on this watch. Favourites only arrive from the iPhone app over Bluetooth, and only if an adult turned that on.")
                .font(.footnote)
        }
        .navigationTitle("Settings")
    }
}
