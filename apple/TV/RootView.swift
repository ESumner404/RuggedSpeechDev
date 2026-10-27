import SwiftUI

/// The tabs along the top. They are always in this order.
struct RootView: View {
    var body: some View {
        TabView {
            TalkView(board: Vocabulary.root)
                .tabItem { Label("Talk", systemImage: "bubble.left.fill") }
            FeelingsView()
                .tabItem { Label("Feelings", systemImage: "face.smiling") }
            HelpView()
                .tabItem { Label("Help", systemImage: "lifepreserver") }
            GamesView()
                .tabItem { Label("Games", systemImage: "gamecontroller") }
            FavouritesView()
                .tabItem { Label("Favourites", systemImage: "star") }
            MyDayView()
                .tabItem { Label("My Day", systemImage: "calendar") }
            TrafficLightView()
                .tabItem { Label("Traffic light", systemImage: "light.beacon.max") }
            LinkView()
                .tabItem { Label("iPad", systemImage: "ipad.landscape") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .onAppear { IPadLink.shared.start() }
    }
}
