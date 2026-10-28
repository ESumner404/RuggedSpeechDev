import SwiftUI

/// Says how someone feels, and how much. "How much" is optional and starts on not saying.
struct FeelingsView: View {
    @State private var howMuch = 0

    private var choices: [String] { ["As it is"] + Vocabulary.intensities }

    var body: some View {
        ScrollView {
            Picker("How much", selection: $howMuch) {
                ForEach(Array(choices.enumerated()), id: \.offset) { index, name in
                    Text(name).tag(index)
                }
            }
            .frame(height: 52)

            LazyVGrid(columns: watchColumns, spacing: 6) {
                ForEach(Vocabulary.feelings) { item in
                    PressButton(emoji: item.emoji, label: item.label, colour: item.colour) {
                        let amount = howMuch == 0 ? "" : ", \(Vocabulary.intensities[howMuch - 1])"
                        Speaker.shared.speak("I feel \(item.label)\(amount)")
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("Feelings")
    }
}
