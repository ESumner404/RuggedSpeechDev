import SwiftUI

struct SettingsView: View {
    @AppStorage(SpeechSpeed.storageKey) private var speed = SpeechSpeed.usual.rawValue

    var body: some View {
        VStack(alignment: .leading, spacing: 30) {
            Text("Voice speed").font(.title2)
            HStack(spacing: 20) {
                ForEach(SpeechSpeed.allCases) { choice in
                    BigButton(emoji: "", label: choice.title, colour: speed == choice.rawValue ? 0xFEF08A : 0xE5E7EB, size: 36) {
                        speed = choice.rawValue
                        Speaker.shared.speak("This is what I sound like.")
                    }
                    .frame(height: 140)
                }
            }
            Text("Works with no internet. Nothing is sent anywhere, and nothing is kept except this.")
                .font(.title3)
                .foregroundStyle(.secondary)
        }
        .padding(60)
    }
}
