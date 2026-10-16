import SwiftUI

/// A page of words, in the same grid the iPhone and iPad app use. A word speaks when pressed; a folder opens.
/// Empty places stay empty, so a word is always where it was.
struct WordsView: View {
    let board: VocabBoard

    private var cells: [VocabItem?] {
        board.order.flatMap { $0 }.map { id in id.flatMap { board.item($0) } }
    }

    var body: some View {
        ScrollView {
            LazyVGrid(columns: watchColumns, spacing: 6) {
                ForEach(Array(cells.enumerated()), id: \.offset) { _, cell in
                    if let item = cell {
                        if let opens = item.opens, let next = Vocabulary.board(opens) {
                            FolderLink(emoji: item.emoji, label: item.label, colour: item.colour) { WordsView(board: next) }
                        } else {
                            PressButton(emoji: item.emoji, label: item.label, colour: item.colour) {
                                Speaker.shared.speak(item.spoken)
                            }
                        }
                    } else {
                        Color.clear.frame(minHeight: 62)
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle(board.name)
    }
}
