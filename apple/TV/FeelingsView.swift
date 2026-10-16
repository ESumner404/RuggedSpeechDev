import SwiftUI

/// Says how someone feels, and how much. "How much" is optional.
struct FeelingsView: View {
    @State private var howMuch = 0

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 16), count: 5)

    var body: some View {
        VStack(spacing: 20) {
            HStack(spacing: 16) {
                BigButton(emoji: "", label: "As it is", colour: howMuch == 0 ? 0xFEF08A : 0xE5E7EB, size: 30) { howMuch = 0 }
                ForEach(Array(Vocabulary.intensities.enumerated()), id: \.offset) { index, name in
                    BigButton(emoji: "", label: name, colour: howMuch == index + 1 ? 0xFEF08A : 0xE5E7EB, size: 30) { howMuch = index + 1 }
                }
            }
            .frame(height: 90)

            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(Vocabulary.feelings) { item in
                    BigButton(emoji: item.emoji, label: item.label, colour: item.colour, size: 28) {
                        let amount = howMuch == 0 ? "" : ", \(Vocabulary.intensities[howMuch - 1])"
                        Speaker.shared.speak("I feel \(item.label)\(amount)")
                    }
                    .frame(height: 170)
                }
            }
        }
        .padding(40)
    }
}
