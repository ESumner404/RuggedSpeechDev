import SwiftUI

/// What the iPad is building and has said, in big letters, for everyone in the room. Only if an adult turned that on in
/// Parent Mode on the iPad: it shows nothing otherwise, because what a child says belongs to the child.
struct ShowingView: View {
    @ObservedObject private var link = IPadLink.shared

    var body: some View {
        VStack(spacing: 40) {
            if !link.isConnected {
                message("Link with the iPad (the iPad tab) to show its sentence here.")
            } else if link.mirror.words.isEmpty && link.mirror.said == nil {
                message("Nothing yet. If this stays empty, turn on \"Show the sentence being built, and what was said, on the Apple TV\" in Parent Mode, Access, on the iPad.")
            } else {
                if !link.mirror.words.isEmpty {
                    Text(link.mirror.words.joined(separator: " "))
                        .font(.system(size: 120, weight: .bold))
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.4)
                }
                if let said = link.mirror.said {
                    VStack(spacing: 8) {
                        Text("Said").font(.title2).foregroundStyle(.secondary)
                        Text(said).font(.system(size: 80, weight: .semibold)).multilineTextAlignment(.center).minimumScaleFactor(0.4)
                    }
                }
            }
        }
        .padding(80)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func message(_ text: String) -> some View {
        Text(text).font(.title).multilineTextAlignment(.center).foregroundStyle(.secondary)
    }
}
