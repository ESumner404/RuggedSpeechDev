import SwiftUI

/// Today's plan from the iPhone: what is happening now and what is next, then the rest of the day.
struct MyDayView: View {
    @ObservedObject private var link = PhoneLink.shared

    var body: some View {
        ScrollView {
            if link.state.today.isEmpty {
                Text("Today's plan from the iPhone shows here, if an adult has turned the link on in Parent Mode and built a day in My Day.")
                    .font(.footnote)
                    .padding()
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    if let now = link.state.now {
                        Card(title: "Now", text: now, colour: 0xBBF7D0)
                    }
                    if let next = link.state.next {
                        Card(title: "Next", text: next, colour: 0xBFDBFE)
                    }
                    Divider()
                    ForEach(Array(link.state.today.enumerated()), id: \.offset) { _, activity in
                        HStack {
                            Text(activity.done ? "✅" : "⬜️")
                            Text([activity.time, activity.name].compactMap { $0 }.joined(separator: " "))
                                .strikethrough(activity.done)
                                .font(.footnote)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }
        }
        .navigationTitle("My Day")
    }
}

private struct Card: View {
    let title: String
    let text: String
    let colour: UInt32

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title).font(.caption).foregroundStyle(Color.buttonText.opacity(0.7))
            Text(text).font(.system(size: 18, weight: .semibold)).foregroundStyle(Color.buttonText)
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(hex: colour), in: RoundedRectangle(cornerRadius: 12))
    }
}
