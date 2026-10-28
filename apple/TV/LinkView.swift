import SwiftUI

/// Shows how to link with the iPad, and then opens its pages from here. Games, Draw and the rest live on the iPad,
/// which is the better screen for them; the television is the big screen for the words.
struct LinkView: View {
    @ObservedObject private var link = IPadLink.shared
    @State private var asked: String?

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 20), count: 5)

    var body: some View {
        if link.isConnected {
            VStack(spacing: 24) {
                Text("Open on the iPad").font(.system(size: 40, weight: .semibold))
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(Launch.all) { item in
                        BigButton(emoji: item.emoji, label: item.label, colour: 0xE5E7EB, size: 30) {
                            link.send(LinkCommand.open(item.id))
                            asked = "Opened \(item.label) on the iPad."
                        }
                        .frame(height: 190)
                    }
                }
                Text(asked ?? "Pressing a button opens that page on the iPad. It never makes the iPad speak.")
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }
            .padding(50)
        } else {
            VStack(spacing: 28) {
                Text("Link with the iPad").font(.system(size: 52, weight: .bold))
                Text("On the iPad or iPhone, open Rugged Speech, then Parent Mode, Access, and type this code under Link with the Apple Watch and Apple TV.")
                    .font(.title2)
                    .multilineTextAlignment(.center)
                Text(link.code)
                    .font(.system(size: 160, weight: .bold, design: .rounded))
                    .tracking(20)
                Text("Looking for the iPad on this wifi… Both need to be on the same home network. Nothing goes to the internet.")
                    .font(.title3)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                BigButton(emoji: "", label: "New code", colour: 0xE5E7EB, size: 30) { link.changeCode() }
                    .frame(width: 360, height: 100)
            }
            .padding(60)
        }
    }
}
