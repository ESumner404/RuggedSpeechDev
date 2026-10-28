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

// MARK: What the iPhone or iPad sends the television: the boards and how the app is set up

struct SyncItem: Codable {
    let id: String
    let label: String
    let spoken: String
    let emoji: String
    let colour: UInt32
    let opens: String?
}

struct SyncBoard: Codable {
    let id: String
    let name: String
    let rows: Int
    let columns: Int
    let order: [[String?]]
    let items: [SyncItem]

    var vocab: VocabBoard {
        VocabBoard(
            id: id, name: name, rows: rows, columns: columns, order: order,
            items: items.map { VocabItem(id: $0.id, label: $0.label, spoken: $0.spoken, emoji: $0.emoji, colour: $0.colour, opens: $0.opens) }
        )
    }
}

struct SyncSpeech: Codable {
    let rate: Double
    let pitch: Double
    let volume: Double
}

struct SyncPronunciation: Codable {
    let written: String
    let spoken: String
}

struct SyncLook: Codable {
    let labels: String        // both, pictures, words
    let lowArousal: Bool
    let textScale: Double     // 1 to 2
    let contrast: String      // off, light, dark
}

/// The words on the boards and how the app is set up, as the iPhone or iPad has them. The television uses these in
/// place of its own starter words, and keeps the last it was sent, so it still matches when the iPad is away.
struct SyncMessage: Codable {
    var type: String = "sync"
    let device: String
    let root: String
    let boards: [SyncBoard]
    let speech: SyncSpeech
    let pronunciations: [SyncPronunciation]
    let look: SyncLook
    let press: String         // sentence, speak, both
    let clearAfterSpeak: Bool

    static func decode(_ json: String) -> SyncMessage? {
        guard json.utf8.count <= 256 * 1024, let data = json.data(using: .utf8),
              let message = try? JSONDecoder().decode(SyncMessage.self, from: data), message.type == "sync",
              message.boards.contains(where: { $0.id == message.root }) else { return nil }
        return message
    }
}

/// What the iPad is building and has said, shown on the television only if an adult turned that on.
struct MirrorState: Codable, Equatable {
    var type: String = "sentence"
    var words: [String] = []
    var said: String? = nil

    static let empty = MirrorState()

    static func decode(_ json: String) -> MirrorState? {
        guard json.utf8.count <= 16 * 1024, let data = json.data(using: .utf8),
              let state = try? JSONDecoder().decode(MirrorState.self, from: data), state.type == "sentence" else { return nil }
        return state
    }
}

extension LinkCommand {
    /// Asks the iPad to send everything again.
    static let syncRequest = #"{"type":"sync-request"}"#
}

/// The Fitzgerald Key colours and their muted (low-arousal) partners, as the iPhone and iPad app has them.
enum LowArousal {
    private static let pairs: [UInt32: UInt32] = [
        0xFEF08A: 0xF5F0DC, 0xBBF7D0: 0xDCEBDC, 0xBFDBFE: 0xDCE6F0, 0xFED7AA: 0xF0E3D4,
        0x99F6E4: 0xD9ECE8, 0xFBCFE8: 0xF0DCE6, 0xE9D5FF: 0xE6DCF0, 0xFECACA: 0xF0D9D9,
    ]

    static func colour(_ hex: UInt32, on: Bool) -> UInt32 { on ? (pairs[hex] ?? hex) : hex }
}
