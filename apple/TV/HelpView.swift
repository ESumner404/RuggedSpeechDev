import SwiftUI

/// Help phrases. Each speaks and stops: nothing is logged, flagged or sent, because the app is not a safeguarding record.
struct HelpView: View {
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 20), count: 3)

    var body: some View {
        LazyVGrid(columns: columns, spacing: 20) {
            ForEach(Vocabulary.help) { item in
                BigButton(emoji: item.emoji, label: item.label, colour: item.colour, size: 34) {
                    Speaker.shared.speak(item.spoken)
                }
                .frame(height: 260)
            }
        }
        .padding(40)
    }
}
