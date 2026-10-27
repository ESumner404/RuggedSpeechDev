import SwiftUI

struct SettingsView: View {
    @AppStorage(SpeechSpeed.storageKey) private var speed = SpeechSpeed.usual.rawValue
    @ObservedObject private var content = TVContent.shared
    @ObservedObject private var link = IPadLink.shared

    var body: some View {
        VStack(alignment: .leading, spacing: 30) {
            if let synced = content.sync {
                Text("Settings from the iPad").font(.title2)
                Text(summary(synced)).font(.title3)
                if let at = content.syncedAt {
                    Text("Last updated \(at.formatted(date: .abbreviated, time: .shortened)).")
                        .font(.title3)
                        .foregroundStyle(.secondary)
                }
                HStack(spacing: 20) {
                    BigButton(emoji: "", label: "Update now", colour: 0xBFDBFE, size: 32) { link.requestSync() }
                        .frame(height: 120)
                        .disabled(!link.isConnected)
                    BigButton(emoji: "", label: "Use this television's own", colour: 0xE5E7EB, size: 32) { content.forget() }
                        .frame(height: 120)
                }
                Text("The words, the voice, the colours and the text size follow the iPad. Change them there, in Parent Mode.")
                    .font(.title3)
                    .foregroundStyle(.secondary)
            } else {
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
                Text("Link with the iPad (the iPad tab) and the words, voice, colours and text size will follow it.")
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }
            Text("Works with no internet. Nothing is sent anywhere.")
                .font(.title3)
                .foregroundStyle(.secondary)
        }
        .padding(60)
    }

    private func summary(_ message: SyncMessage) -> String {
        var parts: [String] = []
        if !message.device.isEmpty { parts.append(message.device) }
        parts.append("voice speed ×\(String(format: "%.2f", message.speech.rate))")
        parts.append(message.press == "speak" ? "words are said when pressed" : (message.press == "both" ? "words are added and said" : "words are added, then Speak"))
        if message.look.textScale > 1 { parts.append("larger text") }
        if message.look.lowArousal { parts.append("muted colours") }
        return parts.joined(separator: ", ") + "."
    }
}
