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
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                if !emoji.isEmpty {
                    Text(emoji).font(.system(size: size * 1.6))
                }
                Text(label)
                    .font(.system(size: size, weight: .semibold))
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.6)
                    .lineLimit(2)
            }
            .padding(12)
        }
        .buttonStyle(BigButtonStyle(colour: colour, folder: folder))
        .focusEffectDisabled()
        .accessibilityLabel(folder ? "\(label), opens more" : label)
    }
}
