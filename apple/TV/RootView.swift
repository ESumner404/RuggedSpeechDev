import SwiftUI

/// The tabs along the top. They are always in this order.
struct RootView: View {
    @ObservedObject private var content = TVContent.shared

    var body: some View {
        TabView {
            TalkView()
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
            ShowingView()
                .tabItem { Label("Showing", systemImage: "text.bubble") }
            TrafficLightView()
                .tabItem { Label("Traffic light", systemImage: "light.beacon.max") }
            LinkView()
                .tabItem { Label("iPad", systemImage: "ipad.landscape") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .preferredColorScheme(content.contrast == "light" ? .light : (content.contrast == "dark" ? .dark : nil))
        .onAppear { IPadLink.shared.start() }
    }
}
