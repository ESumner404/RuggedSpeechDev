import SwiftUI

/// Shows, without words, whether a person wants to be spoken to. Pressed by the child, shown to everyone in the room.
struct TrafficLightView: View {
    private struct Light: Identifiable {
        let id: String
        let name: String
        let message: String
        let colour: Color
        let text: Color
    }

    private let lights = [
        Light(id: "red", name: "Red", message: "Please leave me", colour: Color(hex: 0xDC2626), text: .white),
        Light(id: "amber", name: "Amber", message: "Talk gently and wait for me", colour: Color(hex: 0xF59E0B), text: Color.buttonText),
        Light(id: "green", name: "Green", message: "Happy to talk", colour: Color(hex: 0x16A34A), text: .white),
    ]

    @State private var shown: Light?

    var body: some View {
        ZStack {
            if let light = shown {
                // The whole screen, so everyone in the room can see it. Press anything to put it away.
                Button {
                    shown = nil
                } label: {
                    VStack(spacing: 24) {
                        Text(light.message).font(.system(size: 110, weight: .bold)).multilineTextAlignment(.center)
                        Text("Press to put away").font(.system(size: 32))
                    }
                    .foregroundStyle(light.text)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(light.colour)
                }
                .buttonStyle(.plain)
            } else {
                HStack(spacing: 30) {
                    ForEach(lights) { light in
                        Button {
                            shown = light
                        } label: {
                            Text(light.name).font(.system(size: 60, weight: .bold)).foregroundStyle(light.text)
                        }
                        .buttonStyle(BigButtonStyle(colour: 0xFFFFFF))
                        .background(light.colour, in: RoundedRectangle(cornerRadius: 24))
                        .focusEffectDisabled()
                    }
                }
                .padding(60)
            }
        }
    }
}
