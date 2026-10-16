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
            TrafficLightView()
                .tabItem { Label("Traffic light", systemImage: "light.beacon.max") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
    }
}
