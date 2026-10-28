import SwiftUI

// Three games for the whole family to play together, with the iPad as the AAC player's controller. Everyone takes turns,
// every choice is made with a big button (on the remote or on the iPad), nothing keeps a score or a clock, and nothing
// moves. The television only speaks when someone presses to hear it.

private func colour(_ item: VocabItem) -> UInt32 { item.colour }

/// How many people are playing: the first is the one on the iPad, the rest use the remote.
struct PlayerPicker: View {
    let title: String
    let blurb: String
    let start: (Int) -> Void

    var body: some View {
        VStack(spacing: 40) {
            Text(title).font(.system(size: 64, weight: .bold))
            Text(blurb).font(.title2).multilineTextAlignment(.center).foregroundStyle(.secondary)
            Text("How many are playing?").font(.system(size: 40, weight: .semibold))
            HStack(spacing: 30) {
                ForEach([2, 3, 4], id: \.self) { count in
                    BigButton(emoji: "", label: "\(count)", colour: 0xFEF08A, size: 70) { start(count) }
                        .frame(width: 240, height: 180)
                }
            }
            Text("Player 1 is on the iPad. The others use the Siri Remote. Everyone can also use the iPad.")
                .font(.title3)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(60)
    }
}

private func playerName(_ index: Int) -> String { index == 0 ? "Player 1 (iPad)" : "Player \(index + 1)" }

// MARK: Silly Sentences

/// Each person picks one word in turn, and the television puts them into a silly sentence to read out.
struct SillySentencesView: View {
    @State private var players = 0
    @State private var step = 0
    @State private var picks: [VocabItem] = []
    @State private var options: [VocabItem] = []

    private let steps: [(prompt: String, board: String)] = [
        ("Who is it?", "people"),
        ("What did they want to do?", "actions"),
        ("Where did they go?", "places"),
    ]

    private var turn: Int { players == 0 ? 0 : step % players }
    private var finished: Bool { step >= steps.count }
    private var sentence: String {
        guard picks.count == 3 else { return "" }
        return "\(picks[0].label) wanted to \(picks[1].label.lowercased()) at the \(picks[2].label.lowercased())!"
    }

    var body: some View {
        if players == 0 {
            PlayerPicker(title: "Silly Sentences", blurb: "Take turns choosing a person, a thing to do and a place. Then hear the silly sentence you made.") {
                players = $0
                next()
            }
        } else if finished {
            VStack(spacing: 40) {
                HStack(spacing: 20) { ForEach(picks, id: \.id) { Text($0.emoji).font(.system(size: 150)) } }
                Text(sentence).font(.system(size: 84, weight: .bold)).multilineTextAlignment(.center).minimumScaleFactor(0.4)
                HStack(spacing: 30) {
                    BigButton(emoji: "🔊", label: "Hear it", colour: 0xBFDBFE, size: 40) { hear() }
                    BigButton(emoji: "🔁", label: "Make another", colour: 0xBBF7D0, size: 40) { again() }
                }
                .frame(height: 220)
            }
            .padding(60)
            .onAppear(perform: showController)
            .onDisappear { GameHub.shared.end(game: "silly") }
        } else {
            VStack(spacing: 30) {
                Text(steps[step].prompt).font(.system(size: 64, weight: .bold))
                Text("\(playerName(turn))'s turn").font(.system(size: 36)).foregroundStyle(.secondary)
                if !picks.isEmpty { HStack { ForEach(picks, id: \.id) { Text($0.emoji + " " + $0.label).font(.title2) } } }
                let columns = Array(repeating: GridItem(.flexible(), spacing: 20), count: 3)
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(options) { option in
                        BigButton(emoji: option.emoji, label: option.label, colour: option.colour, size: 40, word: true) { choose(option) }
                            .frame(height: 230)
                    }
                }
            }
            .padding(50)
            .onAppear(perform: showController)
            .onDisappear { GameHub.shared.end(game: "silly") }
        }
    }

    private func pool(_ boardId: String) -> [VocabItem] {
        (TVContent.shared.board(boardId) ?? Vocabulary.board(boardId))?.items.filter { $0.opens == nil && !$0.emoji.isEmpty } ?? []
    }

    private func next() {
        guard step < steps.count else { showController(); return }
        options = Array(pool(steps[step].board).shuffled().prefix(6))
        showController()
    }

    private func choose(_ option: VocabItem) {
        picks.append(option)
        step += 1
        next()
    }

    private func hear() { Speaker.shared.speak(sentence) }

    private func again() {
        picks = []
        step = 0
        next()
    }

    private func showController() {
        GameHub.shared.onInput = { button in
            if button == "quit" { GameHub.shared.end(game: "silly"); return }
            if finished {
                if button == "hear" { hear() } else if button == "again" { again() }
            } else if let index = Int(button.dropFirst()), button.hasPrefix("o"), index < options.count {
                choose(options[index])
            }
        }
        if players == 0 { return }
        if finished {
            GameHub.shared.show(game: "silly", prompt: sentence, buttons: [
                ControllerButton(id: "hear", label: "Hear it", emoji: "🔊", colour: 0xBFDBFE),
                ControllerButton(id: "again", label: "Make another", emoji: "🔁", colour: 0xBBF7D0),
            ])
        } else {
            GameHub.shared.show(
                game: "silly",
                prompt: steps[step].prompt,
                buttons: options.enumerated().map { ControllerButton(id: "o\($0.offset)", label: $0.element.label, emoji: $0.element.emoji, colour: $0.element.colour) },
                yourTurn: turn == 0
            )
        }
    }
}

// MARK: Feelings Stories

/// A short story, and how the person in it feels. Everyone talks about it, and whoever's turn it is chooses.
struct FeelingsStoriesView: View {
    private struct Story { let emoji: String; let text: String; let feeling: String }

    private static let stories: [Story] = [
        Story(emoji: "🎂", text: "Mum gave Sam a big birthday cake.", feeling: "happy"),
        Story(emoji: "🍦", text: "Mia dropped her ice cream on the floor.", feeling: "sad"),
        Story(emoji: "🧸", text: "Someone took Ben's toy without asking.", feeling: "angry"),
        Story(emoji: "🏫", text: "It is the first day at a new school.", feeling: "worried"),
        Story(emoji: "🐕", text: "A big dog barked loudly at Jo.", feeling: "scared"),
        Story(emoji: "🌙", text: "Lily played all day and now it is bedtime.", feeling: "tired"),
        Story(emoji: "🏖️", text: "Tomorrow we are going to the beach!", feeling: "excited"),
        Story(emoji: "📖", text: "Dad is reading a quiet story to Max.", feeling: "calm"),
        Story(emoji: "🔊", text: "The music at the party is very, very loud.", feeling: "too loud"),
        Story(emoji: "🍽️", text: "It is lunchtime and Ella has not eaten since breakfast.", feeling: "hungry"),
        Story(emoji: "🤕", text: "Sam fell over and scraped his knee.", feeling: "hurts"),
        Story(emoji: "❄️", text: "It is snowing and Zara forgot her coat.", feeling: "cold"),
    ]

    @State private var players = 0
    @State private var order: [Int] = Array(0..<FeelingsStoriesView.stories.count).shuffled()
    @State private var round = 0
    @State private var options: [VocabItem] = []
    @State private var message = ""
    @State private var solved = false

    private var story: Story { Self.stories[order[round % order.count]] }
    private var turn: Int { players == 0 ? 0 : round % players }

    var body: some View {
        if players == 0 {
            PlayerPicker(title: "Feelings Stories", blurb: "Hear a short story. How does the person in it feel? Take turns choosing, and talk about why.") {
                players = $0
                nextStory()
            }
        } else {
            HStack(spacing: 60) {
                VStack(spacing: 20) {
                    Text(story.emoji).font(.system(size: 240))
                    Text(story.text).font(.system(size: 52, weight: .semibold)).multilineTextAlignment(.center)
                    Text(solved ? message : "\(playerName(turn))'s turn. How do they feel?")
                        .font(.system(size: 38))
                        .foregroundStyle(solved ? .primary : .secondary)
                        .multilineTextAlignment(.center)
                    HStack(spacing: 20) {
                        BigButton(emoji: "🔊", label: "Hear the story", colour: 0xBFDBFE, size: 30) { Speaker.shared.speak(story.text) }
                        if solved { BigButton(emoji: "➡️", label: "Next story", colour: 0xBBF7D0, size: 30) { nextStory() } }
                    }
                    .frame(height: 100)
                }
                .frame(maxWidth: .infinity)
                VStack(spacing: 16) {
                    ForEach(options) { option in
                        BigButton(emoji: option.emoji, label: option.label, colour: option.colour, size: 40, word: true) { guess(option) }
                    }
                }
                .frame(maxWidth: 560)
            }
            .padding(50)
            .onAppear(perform: showController)
            .onDisappear { GameHub.shared.end(game: "feelings") }
        }
    }

    private func nextStory() {
        if solved { round += 1 }
        solved = false
        message = ""
        let right = Vocabulary.feelings.first { $0.label == story.feeling }
        let wrong = Vocabulary.feelings.filter { $0.label != story.feeling }.shuffled().prefix(3)
        options = ([right].compactMap { $0 } + wrong).shuffled()
        showController()
    }

    private func guess(_ option: VocabItem) {
        if solved { return }
        if option.label == story.feeling {
            solved = true
            message = "Yes! They feel \(story.feeling). Why? Talk about it together."
            Speaker.shared.speak("They feel \(story.feeling)")
        } else {
            message = "Not quite. What else could it be?"
        }
        showController()
    }

    private func showController() {
        GameHub.shared.onInput = { button in
            if button == "quit" { GameHub.shared.end(game: "feelings"); return }
            if button == "next" { if solved { nextStory() }; return }
            if button == "hear" { Speaker.shared.speak(story.text); return }
            if button.hasPrefix("o"), let index = Int(button.dropFirst()), index < options.count { guess(options[index]) }
        }
        if players == 0 { return }
        var buttons = options.enumerated().map { ControllerButton(id: "o\($0.offset)", label: $0.element.label, emoji: $0.element.emoji, colour: $0.element.colour) }
        buttons.append(ControllerButton(id: "hear", label: "Hear the story", emoji: "🔊", colour: 0xBFDBFE))
        if solved { buttons.append(ControllerButton(id: "next", label: "Next story", emoji: "➡️", colour: 0xBBF7D0)) }
        GameHub.shared.show(game: "feelings", prompt: solved ? message : story.text, buttons: buttons, yourTurn: turn == 0)
    }
}

// MARK: Would You Rather

/// Two things, and everyone chooses one in turn. Then see who chose what, and say why.
struct WouldYouRatherView: View {
    private struct Pair { let a: (String, String); let b: (String, String) }

    private static let pairs: [Pair] = [
        Pair(a: ("🍕", "pizza"), b: ("🍝", "pasta")), Pair(a: ("🐶", "a dog"), b: ("🐱", "a cat")),
        Pair(a: ("🏖️", "the beach"), b: ("⛰️", "the mountains")), Pair(a: ("🍦", "ice cream"), b: ("🍰", "cake")),
        Pair(a: ("🌞", "summer"), b: ("❄️", "winter")), Pair(a: ("🚗", "a car ride"), b: ("🚂", "a train ride")),
        Pair(a: ("🛁", "a bath"), b: ("🚿", "a shower")), Pair(a: ("📚", "a story"), b: ("🎵", "a song")),
        Pair(a: ("🎨", "painting"), b: ("🧱", "building")), Pair(a: ("🌳", "the park"), b: ("🏊", "swimming")),
        Pair(a: ("🍎", "an apple"), b: ("🍌", "a banana")), Pair(a: ("🦁", "a lion"), b: ("🐘", "an elephant")),
        Pair(a: ("🛌", "a sleepover"), b: ("🏕️", "camping")), Pair(a: ("🧁", "a cupcake"), b: ("🍪", "a biscuit")),
        Pair(a: ("🚀", "a rocket"), b: ("🚢", "a ship")), Pair(a: ("🎈", "balloons"), b: ("🎁", "presents")),
        Pair(a: ("🌧️", "rain"), b: ("☀️", "sun")), Pair(a: ("🐸", "a frog"), b: ("🦋", "a butterfly")),
        Pair(a: ("🍓", "strawberries"), b: ("🍇", "grapes")), Pair(a: ("🎬", "a film"), b: ("🎲", "a game")),
    ]

    @State private var players = 0
    @State private var order = Array(0..<WouldYouRatherView.pairs.count).shuffled()
    @State private var round = 0
    @State private var votes: [Int] = []   // 0 for the first choice, 1 for the second, one per player so far

    private var pair: Pair { Self.pairs[order[round % order.count]] }
    private var turn: Int { votes.count }
    private var revealed: Bool { players > 0 && votes.count >= players }

    var body: some View {
        if players == 0 {
            PlayerPicker(title: "Would You Rather?", blurb: "Two things. Everyone chooses one, in turn. Then see who chose what, and say why!") {
                players = $0
                showController()
            }
        } else {
            VStack(spacing: 30) {
                Text(revealed ? "Here is what everyone chose" : "\(playerName(turn))'s turn. Would you rather…")
                    .font(.system(size: 48, weight: .semibold))
                HStack(spacing: 40) {
                    choice(0, pair.a)
                    Text("or").font(.system(size: 56, weight: .bold))
                    choice(1, pair.b)
                }
                .frame(height: 440)
                if revealed {
                    Text(votes.enumerated().map { "\(playerName($0.offset)): \($0.element == 0 ? pair.a.1 : pair.b.1)" }.joined(separator: "   "))
                        .font(.title2)
                        .multilineTextAlignment(.center)
                    HStack(spacing: 30) {
                        BigButton(emoji: "🔊", label: "Hear the choices", colour: 0xBFDBFE, size: 30) { hear() }
                        BigButton(emoji: "➡️", label: "Next question", colour: 0xBBF7D0, size: 30) { next() }
                    }
                    .frame(height: 100)
                }
            }
            .padding(50)
            .onAppear(perform: showController)
            .onDisappear { GameHub.shared.end(game: "rather") }
        }
    }

    private func choice(_ index: Int, _ option: (String, String)) -> some View {
        let chosenBy = votes.enumerated().filter { $0.element == index }.map { playerName($0.offset) }
        return VStack(spacing: 10) {
            BigButton(emoji: option.0, label: option.1, colour: index == 0 ? 0xFED7AA : 0xBFDBFE, size: 56) { vote(index) }
            if revealed { Text(chosenBy.isEmpty ? " " : chosenBy.joined(separator: ", ")).font(.title3) }
        }
    }

    private func vote(_ index: Int) {
        guard !revealed else { return }
        votes.append(index)
        showController()
    }

    private func hear() {
        let said = votes.enumerated().map { "\(playerName($0.offset)) chose \($0.element == 0 ? pair.a.1 : pair.b.1)" }.joined(separator: ". ")
        Speaker.shared.speak(said)
    }

    private func next() {
        round += 1
        votes = []
        showController()
    }

    private func showController() {
        GameHub.shared.onInput = { button in
            switch button {
            case "quit": GameHub.shared.end(game: "rather")
            case "a": vote(0)
            case "b": vote(1)
            case "hear": hear()
            case "next": if revealed { next() }
            default: break
            }
        }
        if players == 0 { return }
        if revealed {
            GameHub.shared.show(game: "rather", prompt: "Say why you chose it!", buttons: [
                ControllerButton(id: "hear", label: "Hear the choices", emoji: "🔊", colour: 0xBFDBFE),
                ControllerButton(id: "next", label: "Next question", emoji: "➡️", colour: 0xBBF7D0),
            ])
        } else {
            GameHub.shared.show(game: "rather", prompt: "Would you rather…", buttons: [
                ControllerButton(id: "a", label: pair.a.1, emoji: pair.a.0, colour: 0xFED7AA),
                ControllerButton(id: "b", label: pair.b.1, emoji: pair.b.0, colour: 0xBFDBFE),
            ], yourTurn: turn == 0)
        }
    }
}
