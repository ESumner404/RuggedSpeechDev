import SwiftUI

/// The first page. The buttons here are in the same place every time: the watch never rearranges itself.
struct RootView: View {
    private let essentials: [(id: String, emoji: String, colour: UInt32)] = [
        ("yes", "✅", 0xE9D5FF),
        ("no", "🚫", 0xFECACA),
        ("break", "⏸️", 0xBFDBFE),
        ("toilet", "🚻", 0x99F6E4),
        ("finished", "🏁", 0xBBF7D0),
        ("question", "❓", 0xFED7AA),
        ("again", "🔁", 0xE9D5FF),
    ]

    @ObservedObject private var link = PhoneLink.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                if let now = link.state.now {
                    NavigationLink { MyDayView() } label: {
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Now").font(.caption2).foregroundStyle(Color.buttonText.opacity(0.7))
                            Text(now).font(.system(size: 15, weight: .semibold)).foregroundStyle(Color.buttonText).lineLimit(2)
                        }
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: 0xBBF7D0), in: RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                    .padding(.bottom, 6)
                }
                LazyVGrid(columns: watchColumns, spacing: 6) {
                    ForEach(essentials, id: \.id) { entry in
                        if let phrase = Vocabulary.quickPhrase(entry.id) {
                            PressButton(emoji: entry.emoji, label: phrase.label, colour: entry.colour) {
                                Speaker.shared.speak(phrase.spoken)
                            }
                        }
                    }
                    FolderLink(emoji: "🆘", label: "Help", colour: 0xFBCFE8) { HelpView() }
                }

                PressButton(emoji: "⏳", label: "Give me time", colour: 0xBFDBFE) {
                    Speaker.shared.speak(Vocabulary.giveMeTime)
                }
                .padding(.top, 6)

                Divider().padding(.vertical, 8)

                LazyVGrid(columns: watchColumns, spacing: 6) {
                    FolderLink(emoji: "💬", label: "Words", colour: 0xFEF08A) { WordsView(board: Vocabulary.root) }
                    FolderLink(emoji: "😊", label: "Feelings", colour: 0xBFDBFE) { FeelingsView() }
                    FolderLink(emoji: "⭐", label: "Favourites", colour: 0xFEF08A) { FavouritesView() }
                    FolderLink(emoji: "📅", label: "My Day", colour: 0xBBF7D0) { MyDayView() }
                    FolderLink(emoji: "🚦", label: "Traffic light", colour: 0xFED7AA) { TrafficView() }
                    FolderLink(emoji: "📱", label: "On iPhone", colour: 0xE5E7EB) { OnPhoneView() }
                    FolderLink(emoji: "⚙️", label: "Settings", colour: 0xE5E7EB) { SettingsView() }
                }
            }
            .padding(.horizontal, 4)
            .navigationTitle("Rugged Speech")
        }
    }
}
