import Foundation

/// A button the iPad shows while a game is on.
struct ControllerButton: Codable {
    let id: String
    let label: String
    let emoji: String
    let colour: UInt32
}

/// What the television asks the iPad to show for the game on screen: a question and a few big buttons.
struct ControllerSpec: Codable {
    var type = "controller"
    let game: String
    let prompt: String
    let buttons: [ControllerButton]
    let yourTurn: Bool
}

/// Joins the game on the television screen to the iPad that is its controller. The iPad shows the buttons the game
/// asks for, and its presses come back here. Only a game on screen takes them, and a press is only ever a person pressing.
final class GameHub {
    static let shared = GameHub()

    /// Where presses from the iPad go: the game that is on screen, if any.
    var onInput: ((String) -> Void)?

    func show(game: String, prompt: String, buttons: [ControllerButton], yourTurn: Bool = true) {
        send(ControllerSpec(game: game, prompt: prompt, buttons: buttons, yourTurn: yourTurn))
    }

    /// The game is over: the iPad goes back to what it was doing.
    func end(game: String) {
        onInput = nil
        send(ControllerSpec(game: game, prompt: "", buttons: [], yourTurn: true))
    }

    private func send(_ spec: ControllerSpec) {
        guard let data = try? JSONEncoder().encode(spec), let json = String(data: data, encoding: .utf8) else { return }
        IPadLink.shared.send(json)
    }

    func receive(_ json: String) {
        struct Input: Decodable { let button: String }
        guard json.utf8.count <= 1024, let data = json.data(using: .utf8),
              let input = try? JSONDecoder().decode(Input.self, from: data), input.button.count <= 24 else { return }
        DispatchQueue.main.async { self.onInput?(input.button) }
    }
}
