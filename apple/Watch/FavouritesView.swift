import SwiftUI

/// Favourites sent from the iPhone app, in the order the iPhone app has them.
struct FavouritesView: View {
    @ObservedObject private var link = PhoneLink.shared

    var body: some View {
        ScrollView {
            if link.favourites.isEmpty {
                Text("Favourites from the iPhone app show here, if an adult has turned that on in Parent Mode, Access.")
                    .font(.footnote)
                    .padding()
            } else {
                LazyVStack(spacing: 6) {
                    ForEach(link.favourites) { favourite in
                        PressButton(emoji: favourite.emoji, label: favourite.label, colour: favourite.colour) {
                            Speaker.shared.speak(favourite.spoken)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }
        }
        .navigationTitle("Favourites")
    }
}
