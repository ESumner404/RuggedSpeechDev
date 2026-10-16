import SwiftUI

/// Help phrases. Each speaks and stops: nothing is logged, flagged or sent, because the watch is not a safeguarding record.
struct HelpView: View {
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 6) {
                ForEach(Vocabulary.help) { item in
                    PressButton(emoji: item.emoji, label: item.label, colour: item.colour) {
                        Speaker.shared.speak(item.spoken)
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("Help")
    }
}
