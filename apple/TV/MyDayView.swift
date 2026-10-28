import SwiftUI

/// Today's plan from the iPad, big enough to read from the sofa: what is happening now and what is next.
struct MyDayView: View {
    @ObservedObject private var link = IPadLink.shared

    var body: some View {
        if link.state.today.isEmpty {
            Text(link.isConnected
                 ? "Nothing planned for today. Build a day in Parent Mode, My Day, on the iPad."
                 : "Link with the iPad (the iPad tab) to see today's plan here.")
                .font(.title)
                .multilineTextAlignment(.center)
                .padding(80)
        } else {
            HStack(alignment: .top, spacing: 40) {
                VStack(spacing: 24) {
                    if let now = link.state.now { card("Now", now, 0xBBF7D0) }
                    if let next = link.state.next { card("Next", next, 0xBFDBFE) }
                }
                .frame(maxWidth: .infinity)
                VStack(alignment: .leading, spacing: 14) {
                    ForEach(Array(link.state.today.enumerated()), id: \.offset) { _, activity in
                        HStack(spacing: 16) {
                            Text(activity.done ? "✅" : "⬜️")
                            Text([activity.time, activity.name].compactMap { $0 }.joined(separator: "  "))
                                .strikethrough(activity.done)
                        }
                        .font(.system(size: 36))
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(60)
        }
    }

    private func card(_ title: String, _ text: String, _ colour: UInt32) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.system(size: 34)).foregroundStyle(Color.buttonText.opacity(0.7))
            Text(text).font(.system(size: 70, weight: .bold)).foregroundStyle(Color.buttonText).minimumScaleFactor(0.5)
        }
        .padding(36)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(hex: colour), in: RoundedRectangle(cornerRadius: 28))
    }
}
