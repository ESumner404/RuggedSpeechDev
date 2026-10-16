import SwiftUI

/// Opens pages on the iPhone, such as Games or Draw, which need the bigger screen. Opens a page and nothing more:
/// nothing here ever makes the iPhone speak.
struct OnPhoneView: View {
    @ObservedObject private var link = PhoneLink.shared

    var body: some View {
        ScrollView {
            Text("Open on the iPhone")
                .font(.footnote)
                .foregroundStyle(.secondary)
            LazyVGrid(columns: watchColumns, spacing: 6) {
                ForEach(Launch.all) { item in
                    PressButton(emoji: item.emoji, label: item.label, colour: 0xE5E7EB) {
                        link.ask(LinkCommand.open(item.id), done: "Opened \(item.label) on the iPhone.")
                    }
                }
            }
            .padding(.horizontal, 4)
            if let result = link.result {
                Text(result).font(.footnote).padding(8).accessibilityAddTraits(.updatesFrequently)
            }
        }
        .navigationTitle("On iPhone")
        .onDisappear { link.result = nil }
    }
}
