import SwiftUI

/// What has been pressed so far, ready to be spoken. Only the Speak button says it.
final class Sentence: ObservableObject {
    @Published var words: [String] = []

    var text: String { words.joined(separator: " ") }

    func add(_ word: String) { words.append(word) }
    func removeLast() { if !words.isEmpty { words.removeLast() } }
    func clear() { words.removeAll() }
}

/// The Talk page: a sentence along the top, the words in a fixed grid, and the always-there buttons underneath.
struct TalkView: View {
    let board: VocabBoard
    @StateObject private var sentence = Sentence()
    @State private var path: [String] = []

    var body: some View {
        NavigationStack(path: $path) {
            page(for: board)
                .navigationDestination(for: String.self) { id in
                    if let next = Vocabulary.board(id) { page(for: next) }
                }
        }
        .environmentObject(sentence)
    }

    private func page(for board: VocabBoard) -> some View {
        VStack(spacing: 20) {
            SentenceStrip()
            WordGrid(board: board) { opens in path.append(opens) }
            QuickRow()
        }
        .padding(40)
    }
}

struct SentenceStrip: View {
    @EnvironmentObject private var sentence: Sentence

    var body: some View {
        HStack(spacing: 20) {
            Text(sentence.words.isEmpty ? "Press words to build a sentence" : sentence.text)
                .font(.system(size: 44, weight: .semibold))
                .foregroundStyle(sentence.words.isEmpty ? .secondary : .primary)
                .frame(maxWidth: .infinity, alignment: .leading)
                .lineLimit(2)
                .minimumScaleFactor(0.6)

            Button("Back") { sentence.removeLast() }
                .disabled(sentence.words.isEmpty)
            Button("Clear") { sentence.clear() }
                .disabled(sentence.words.isEmpty)
            Button("Speak") { Speaker.shared.speak(sentence.text) }
                .disabled(sentence.words.isEmpty)
        }
        .frame(height: 100)
    }
}

/// A page of words in the grid the other apps use. Empty places stay empty.
struct WordGrid: View {
    let board: VocabBoard
    let open: (String) -> Void
    @EnvironmentObject private var sentence: Sentence

    var body: some View {
        VStack(spacing: 16) {
            ForEach(Array(board.order.enumerated()), id: \.offset) { _, row in
                HStack(spacing: 16) {
                    ForEach(Array(row.enumerated()), id: \.offset) { _, id in
                        cell(id)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func cell(_ id: String?) -> some View {
        if let id, let item = board.item(id) {
            if let opens = item.opens {
                BigButton(emoji: item.emoji, label: item.label, colour: item.colour, folder: true, size: 34) { open(opens) }
            } else {
                BigButton(emoji: item.emoji, label: item.label, colour: item.colour, size: 34) { sentence.add(item.spoken) }
            }
        } else {
            Color.clear.frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

/// Buttons that speak straight away, always along the bottom.
struct QuickRow: View {
    private let ids = ["yes", "no", "break", "toilet", "finished"]

    var body: some View {
        HStack(spacing: 16) {
            ForEach(ids, id: \.self) { id in
                if let phrase = Vocabulary.quickPhrase(id) {
                    BigButton(emoji: "", label: phrase.label, colour: 0xE5E7EB, size: 32) { Speaker.shared.speak(phrase.spoken) }
                }
            }
            BigButton(emoji: "", label: "Give me time", colour: 0xBFDBFE, size: 32) { Speaker.shared.speak(Vocabulary.giveMeTime) }
        }
        .frame(height: 100)
    }
}
