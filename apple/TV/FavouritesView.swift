import SwiftUI

/// The iPad's Favourites, in the order it has them, spoken through the television when pressed.
struct FavouritesView: View {
    @ObservedObject private var link = IPadLink.shared

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 20), count: 4)

    var body: some View {
        if link.state.favourites.isEmpty {
            Text(link.isConnected
                 ? "No Favourites yet. Hold a word on the iPad to add one."
                 : "Link with the iPad (the iPad tab) to see its Favourites here.")
                .font(.title)
                .multilineTextAlignment(.center)
                .padding(80)
        } else {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(link.state.favourites) { favourite in
                        BigButton(emoji: favourite.emoji, label: favourite.label, colour: favourite.colour, size: 32) {
                            Speaker.shared.speak(favourite.spoken)
                        }
                        .frame(height: 220)
                    }
                }
                .padding(50)
            }
        }
    }
}
