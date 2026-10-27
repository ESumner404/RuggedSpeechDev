import SwiftUI

/// A big button for the Siri Remote. The one with focus is shown by a thick outline, not by growing or moving:
/// nothing on this screen animates, and every button stays exactly where it is.
struct BigButtonStyle: ButtonStyle {
    let colour: UInt32
    var folder = false

    @Environment(\.isFocused) private var isFocused

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(Color.buttonText)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(hex: colour), in: RoundedRectangle(cornerRadius: 24))
            .overlay(
                RoundedRectangle(cornerRadius: 24)
                    .stroke(isFocused ? Color.white : (folder ? Color.buttonText : Color.clear), lineWidth: isFocused ? 12 : 4)
            )
            .shadow(color: isFocused ? .black.opacity(0.6) : .clear, radius: 0)
            .opacity(configuration.isPressed ? 0.8 : 1)
            .transaction { $0.animation = nil }
    }
}

struct BigButton: View {
    let emoji: String
    let label: String
    let colour: UInt32
    var folder = false
    var size: CGFloat = 44
    /// A word from the boards, which follows the iPad's choice of pictures, words or both, and its muted colours.
    var word = false
    let action: () -> Void

    @ObservedObject private var content = TVContent.shared

    var body: some View {
        let showPicture = !emoji.isEmpty && !(word && content.labels == "words")
        let showLabel = !(word && content.labels == "pictures" && !emoji.isEmpty)
        let scale = CGFloat(content.textScale)
        Button(action: action) {
            VStack(spacing: 8) {
                if showPicture {
                    Text(emoji).font(.system(size: size * 1.6 * scale))
                }
                if showLabel {
                    Text(label)
                        .font(.system(size: size * scale, weight: .semibold))
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.5)
                        .lineLimit(2)
                }
            }
            .padding(12)
        }
        .buttonStyle(BigButtonStyle(colour: LowArousal.colour(colour, on: content.lowArousal), folder: folder))
        .focusEffectDisabled()
        .accessibilityLabel(folder ? "\(label), opens more" : label)
    }
}
