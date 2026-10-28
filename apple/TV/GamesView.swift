import SwiftUI

// Games on the big screen, made from the same words as the iPhone and iPad app. None keeps a score against anyone,
// none has a clock, nothing moves, and nothing speaks unless a button is pressed (PRINCIPLES.md I5). The other games
// (Rollercoaster, Draw, Jokes, Music, Piano, Seasons, Make a tree) are on the iPad, and open from here once linked.

/// The words the games can use: a picture, not a folder, and a label no other button shares.
enum GameWords {
    static let all: [VocabItem] = {
        var seen = Set<String>()
        var words: [VocabItem] = []
        for board in Vocabulary.boards {
            for item in board.items where item.opens == nil && !item.emoji.isEmpty {
                let key = item.label.trimmingCharacters(in: .whitespaces).lowercased()
                if key.isEmpty || seen.contains(key) { continue }
                seen.insert(key)
                words.append(item)
            }
        }
        return words
    }()
}

private enum Game: String, Hashable {
    case find, snap, silly, feelings, rather
}

/// The menu. The tiles are always in this order.
struct GamesView: View {
    @ObservedObject private var link = IPadLink.shared
    @State private var path: [Game] = []
    @State private var asked: String?

    var body: some View {
        NavigationStack(path: $path) {
            VStack(spacing: 24) {
                Text("Games").font(.system(size: 52, weight: .bold))
                HStack(spacing: 30) {
                    tile("🔎", "Find the word", "Match the word to the picture.") { path.append(.find) }
                    tile("🃏", "Snap", "Turn the cards. Press SNAP for two the same.") { path.append(.snap) }
                    tile("📱", "More on the iPad", "Rollercoaster, Draw, Jokes, Music, Piano and more.") {
                        if link.isConnected {
                            link.send(LinkCommand.open("game"))
                            asked = "Opened Games on the iPad."
                        } else {
                            asked = "Link with the iPad first (the iPad tab)."
                        }
                    }
                }
                .frame(height: 300)
                Text("For the whole family, with the iPad as a controller").font(.title2).foregroundStyle(.secondary)
                HStack(spacing: 30) {
                    tile("🤪", "Silly Sentences", "Build a silly sentence together.") { path.append(.silly) }
                    tile("🎭", "Feelings Stories", "How does the person feel?") { path.append(.feelings) }
                    tile("🤔", "Would You Rather?", "Choose one, then say why.") { path.append(.rather) }
                }
                .frame(height: 300)
                Text(asked ?? "").font(.title3).foregroundStyle(.secondary).frame(height: 40)
            }
            .padding(60)
            .navigationDestination(for: Game.self) { game in
                switch game {
                case .find: FindTheWordView()
                case .snap: SnapView()
                case .silly: SillySentencesView()
                case .feelings: FeelingsStoriesView()
                case .rather: WouldYouRatherView()
                }
            }
        }
    }

    private func tile(_ emoji: String, _ name: String, _ hint: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 10) {
                Text(emoji).font(.system(size: 90))
                Text(name).font(.system(size: 40, weight: .bold))
                Text(hint).font(.system(size: 24)).multilineTextAlignment(.center).opacity(0.8)
            }
            .padding(24)
        }
        .buttonStyle(BigButtonStyle(colour: 0xFEF08A, folder: true))
        .focusEffectDisabled()
    }
}

// MARK: Find the word

/// A picture, and four words to choose from: one right, three not.
struct FindTheWordView: View {
    @State private var target = GameWords.all.randomElement()!
    @State private var options: [VocabItem] = []
    @State private var message = "Which word goes with the picture?"

    var body: some View {
        HStack(spacing: 60) {
            VStack(spacing: 24) {
                Text(target.emoji).font(.system(size: 280))
                Text(message)
                    .font(.system(size: 36, weight: .semibold))
                    .multilineTextAlignment(.center)
                    .frame(height: 110)
                HStack(spacing: 20) {
                    BigButton(emoji: "", label: "Hear the word", colour: 0xBFDBFE, size: 30) { Speaker.shared.speak(target.label) }
                    BigButton(emoji: "", label: "Next picture", colour: 0xE5E7EB, size: 30) { next() }
                }
                .frame(height: 100)
            }
            .frame(maxWidth: .infinity)

            VStack(spacing: 20) {
                ForEach(options) { option in
                    BigButton(emoji: "", label: option.label, colour: option.colour, size: 50) { choose(option) }
                }
            }
            .frame(maxWidth: .infinity)
        }
        .padding(60)
        .onAppear { if options.isEmpty { next() } else { showController() } }
        .onDisappear { GameHub.shared.end(game: "find") }
    }

    /// The iPad shows the four words, and Hear the word and Next picture, in the same places.
    private func showController() {
        GameHub.shared.onInput = { button in
            switch button {
            case "quit": GameHub.shared.end(game: "find")
            case "hear": Speaker.shared.speak(target.label)
            case "next": next()
            default:
                if button.hasPrefix("o"), let index = Int(button.dropFirst()), index < options.count { choose(options[index]) }
            }
        }
        var buttons = options.enumerated().map { ControllerButton(id: "o\($0.offset)", label: $0.element.label, emoji: "", colour: $0.element.colour) }
        buttons.append(ControllerButton(id: "hear", label: "Hear the word", emoji: "🔊", colour: 0xBFDBFE))
        buttons.append(ControllerButton(id: "next", label: "Next picture", emoji: "➡️", colour: 0xE5E7EB))
        GameHub.shared.show(game: "find", prompt: "\(target.emoji)  \(message)", buttons: buttons)
    }

    private func next() {
        let others = GameWords.all.filter { $0.id != target.id }
        guard others.count >= 3 else { return }
        let previous = target
        var fresh = others.randomElement()!
        if fresh.id == previous.id, let other = others.first(where: { $0.id != previous.id }) { fresh = other }
        target = fresh
        let wrong = others.filter { $0.id != fresh.id }.shuffled().prefix(3)
        options = ([fresh] + wrong).shuffled()
        message = "Which word goes with the picture?"
        showController()
    }

    private func choose(_ option: VocabItem) {
        Speaker.shared.speak(option.label)
        message = option.id == target.id ? "Yes! That is \(option.label)." : "Not that one. Try another."
        showController()
    }
}

// MARK: Snap

/// Twelve cards. About one in three repeats the one before it, so there are snaps to find.
struct SnapDeck {
    let cards: [VocabItem]
    let snaps: Int

    static func make(length: Int = 12) -> SnapDeck {
        let words = GameWords.all
        var cards: [VocabItem] = []
        var snaps = 0
        for i in 0..<length {
            if let previous = cards.last {
                let repeatsBefore = i >= 2 && cards[i - 2].id == previous.id
                if !repeatsBefore && Double.random(in: 0..<1) < 0.35 {
                    cards.append(previous)
                    snaps += 1
                    continue
                }
            }
            let others = words.filter { $0.id != cards.last?.id }
            cards.append(others.randomElement()!)
        }
        return SnapDeck(cards: cards, snaps: snaps)
    }
}

/// Turn a card; if it is the same as the one before, press SNAP.
struct SnapView: View {
    @State private var deck = SnapDeck.make()
    @State private var index = -1
    @State private var found = 0
    @State private var called = Set<Int>()
    @State private var message = "Turn a card to start."

    private var finished: Bool { index == deck.cards.count - 1 }
    private var current: VocabItem? { index >= 0 ? deck.cards[index] : nil }

    var body: some View {
        VStack(spacing: 30) {
            if let card = current {
                VStack(spacing: 8) {
                    Text(card.emoji).font(.system(size: 260))
                    Text(card.label).font(.system(size: 56, weight: .bold))
                }
                .frame(maxWidth: 700)
                .padding(30)
                .background(Color(hex: card.colour), in: RoundedRectangle(cornerRadius: 36))
                .foregroundStyle(Color.buttonText)
            } else {
                Text("🃏").font(.system(size: 280)).frame(height: 440)
            }
            Text(finished ? "\(message) All done. Snaps found: \(found) of \(deck.snaps)." : message)
                .font(.system(size: 34, weight: .semibold))
                .multilineTextAlignment(.center)
                .frame(height: 100)
            HStack(spacing: 30) {
                BigButton(emoji: "", label: "SNAP!", colour: 0xFECACA, size: 50) { snap() }
                    .disabled(index < 1)
                if finished {
                    BigButton(emoji: "", label: "Play again", colour: 0xBBF7D0, size: 44) { restart() }
                } else {
                    BigButton(emoji: "", label: index < 0 ? "Turn a card" : "Turn the next card", colour: 0xBFDBFE, size: 44) { turn() }
                }
            }
            .frame(height: 130)
        }
        .padding(50)
        .onAppear { showController() }
        .onDisappear { GameHub.shared.end(game: "snap") }
    }

    /// The iPad shows SNAP! and Turn the next card, in the same two places.
    private func showController() {
        GameHub.shared.onInput = { button in
            switch button {
            case "quit": GameHub.shared.end(game: "snap")
            case "snap": snap()
            case "turn": if finished { restart() } else { turn() }
            default: break
            }
        }
        GameHub.shared.show(game: "snap", prompt: message.isEmpty ? (current.map { "\($0.emoji)  \($0.label)" } ?? "Turn a card to start.") : message, buttons: [
            ControllerButton(id: "snap", label: "SNAP!", emoji: "✋", colour: 0xFECACA),
            ControllerButton(id: "turn", label: finished ? "Play again" : (index < 0 ? "Turn a card" : "Turn the next card"), emoji: "🃏", colour: 0xBFDBFE),
        ])
    }

    private func turn() {
        guard index < deck.cards.count - 1 else { return }
        let before = index >= 1 && deck.cards[index].id == deck.cards[index - 1].id && !called.contains(index)
        index += 1
        message = before ? "Those two were the same, so that was a snap." : ""
        showController()
    }

    private func snap() {
        guard index >= 1 else { return }
        Speaker.shared.speak("Snap!")
        if deck.cards[index].id == deck.cards[index - 1].id {
            if called.contains(index) {
                message = "You have already called that one."
            } else {
                called.insert(index)
                found += 1
                message = "Snap! Two \(deck.cards[index].label)."
            }
        } else {
            message = "Not the same this time. Keep looking."
        }
        showController()
    }

    private func restart() {
        deck = SnapDeck.make()
        index = -1
        found = 0
        called = []
        message = "Turn a card to start."
        showController()
    }
}
