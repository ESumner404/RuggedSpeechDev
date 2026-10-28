import SwiftUI

extension Color {
    /// A colour from 0xRRGGBB.
    init(hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1
        )
    }

    /// The writing on every coloured button. The Fitzgerald Key colours are all pale, so this is always dark.
    static let buttonText = Color(hex: 0x0F1E2E)

    /// The brand navy and yellow from the logo.
    static let brandNavy = Color(hex: 0x0F1E2E)
    static let brandYellow = Color(hex: 0xFFC72C)
}
