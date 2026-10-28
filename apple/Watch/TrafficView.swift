import SwiftUI
import WatchKit

/// Shows, without words, whether the wearer wants to be spoken to. Pressed here, it is shown on the iPhone too.
struct TrafficView: View {
    @ObservedObject private var link = PhoneLink.shared
    @AppStorage("trafficLight") private var local = "off"

    private var current: String { link.state.traffic ?? local }

    var body: some View {
        if let light = TrafficColour.all.first(where: { $0.id == current }) {
            Button {
                set("off")
            } label: {
                VStack(spacing: 8) {
                    Text(light.message).font(.system(size: 24, weight: .bold)).multilineTextAlignment(.center)
                    Text("Press to put away").font(.footnote)
                }
                .foregroundStyle(light.lightText ? Color.white : Color.buttonText)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(hex: light.hex))
            }
            .buttonStyle(.plain)
            .ignoresSafeArea()
        } else {
            ScrollView {
                VStack(spacing: 6) {
                    ForEach(TrafficColour.all) { light in
                        Button { set(light.id) } label: {
                            Text(light.name)
                                .font(.system(size: 18, weight: .bold))
                                .foregroundStyle(light.lightText ? Color.white : Color.buttonText)
                                .frame(maxWidth: .infinity, minHeight: 56)
                                .background(Color(hex: light.hex), in: RoundedRectangle(cornerRadius: 12))
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 4)
            }
            .navigationTitle("Traffic light")
        }
    }

    private func set(_ status: String) {
        WKInterfaceDevice.current().play(.click)
        local = status
        link.ask(LinkCommand.traffic(status), done: "")
    }
}
