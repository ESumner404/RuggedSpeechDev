import Foundation

// The link between the watch, the television and the iPhone or iPad app: small pieces of JSON, in the same shape the
// page sends (src/renderer/platform/appleLink.ts). Nothing the child has said or typed is ever in them.

/// A favourite sent from the iPhone or iPad app.
struct Favourite: Codable, Identifiable, Hashable {
    let id: String
    let label: String
    let spoken: String
    let emoji: String
    let colour: UInt32
}

/// One thing in today's plan.
struct LinkActivity: Codable, Hashable {
    let name: String
    let time: String?
    let done: Bool
}

/// What the iPhone or iPad says about itself: the page that is open, the traffic light, today's plan and the Favourites.
struct LinkState: Codable, Equatable {
    var type: String = "state"
    var screen: String? = nil
    var traffic: String? = nil
    var now: String? = nil
    var next: String? = nil
    var today: [LinkActivity] = []
    var favourites: [Favourite] = []

    static let empty = LinkState()

    static func decode(_ json: String) -> LinkState? {
        guard json.utf8.count <= 64 * 1024, let data = json.data(using: .utf8),
              let state = try? JSONDecoder().decode(LinkState.self, from: data), state.type == "state" else { return nil }
        return LinkState(
            screen: state.screen.map { String($0.prefix(30)) },
            traffic: state.traffic,
            now: state.now.map { String($0.prefix(80)) },
            next: state.next.map { String($0.prefix(80)) },
            today: Array(state.today.prefix(12)),
            favourites: Array(state.favourites.prefix(30))
        )
    }
}

/// What can be asked of the iPhone or iPad. It can open an ordinary page or change the traffic light, and nothing more:
/// no command ever makes it speak.
enum LinkCommand {
    static func open(_ screen: String) -> String { #"{"type":"open","screen":"\#(screen)"}"# }
    static func traffic(_ status: String) -> String { #"{"type":"traffic","status":"\#(status)"}"# }
}

/// A page on the iPhone or iPad that the watch or the television can open.
struct Launch: Identifiable, Hashable {
    let id: String
    let label: String
    let emoji: String

    static let all: [Launch] = [
        Launch(id: "game", label: "Games", emoji: "🎮"),
        Launch(id: "draw", label: "Draw", emoji: "🎨"),
        Launch(id: "music", label: "Music", emoji: "🎵"),
        Launch(id: "myday", label: "My Day", emoji: "📅"),
        Launch(id: "firstthen", label: "First / Then", emoji: "➡️"),
        Launch(id: "body", label: "My body", emoji: "🧍"),
        Launch(id: "feelings", label: "Feelings & Help", emoji: "😊"),
        Launch(id: "mypages", label: "My Pages", emoji: "📄"),
        Launch(id: "keyboard", label: "Keyboard", emoji: "⌨️"),
        Launch(id: "talk", label: "Talk", emoji: "💬"),
    ]
}

/// The traffic light's three colours, as the iPhone and iPad app has them.
struct TrafficColour: Identifiable, Hashable {
    let id: String
    let name: String
    let message: String
    let hex: UInt32
    let lightText: Bool

    static let all: [TrafficColour] = [
        TrafficColour(id: "red", name: "Red", message: "Please leave me", hex: 0xDC2626, lightText: true),
        TrafficColour(id: "amber", name: "Amber", message: "Talk gently and wait for me", hex: 0xF59E0B, lightText: false),
        TrafficColour(id: "green", name: "Green", message: "Happy to talk", hex: 0x16A34A, lightText: true),
    ]
}
