import SwiftUI
import WatchKit

/// A big coloured button that speaks when pressed. Pressing is the only thing that ever makes the watch speak.
struct PressButton: View {
    let emoji: String
    let label: String
    let colour: UInt32
    let action: () -> Void

    var body: some View {
        Button {
            WKInterfaceDevice.current().play(.click)
            action()
        } label: {
            VStack(spacing: 2) {
                if !emoji.isEmpty {
                    Text(emoji).font(.system(size: 26))
                }
                Text(label)
                    .font(.system(size: 14, weight: .semibold))
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.7)
                    .lineLimit(2)
            }
            .foregroundStyle(Color.buttonText)
            .frame(maxWidth: .infinity, minHeight: 62)
            .padding(.vertical, 4)
            .background(Color(hex: colour), in: RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }
}

/// A button that opens a page, drawn a little differently so it is never mistaken for one that speaks.
struct FolderLink<Destination: View>: View {
    let emoji: String
    let label: String
    let colour: UInt32
    @ViewBuilder let destination: () -> Destination

    var body: some View {
        NavigationLink {
            destination()
        } label: {
            VStack(spacing: 2) {
                Text(emoji).font(.system(size: 26))
                Text(label)
                    .font(.system(size: 14, weight: .semibold))
                    .minimumScaleFactor(0.7)
                    .lineLimit(2)
            }
            .foregroundStyle(Color.buttonText)
            .frame(maxWidth: .infinity, minHeight: 62)
            .padding(.vertical, 4)
            .background(Color(hex: colour), in: RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.buttonText, lineWidth: 2))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(label), opens more")
    }
}

let watchColumns = [GridItem(.flexible(), spacing: 6), GridItem(.flexible(), spacing: 6)]
