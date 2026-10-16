import AVFoundation
import Foundation

/// How fast the voice speaks. Chosen by an adult in Settings; Usual until then.
enum SpeechSpeed: String, CaseIterable, Identifiable {
    case slow, usual, quick

    var id: String { rawValue }

    var title: String {
        switch self {
        case .slow: return "Slow"
        case .usual: return "Usual"
        case .quick: return "Quick"
        }
    }

    var rate: Float {
        switch self {
        case .slow: return AVSpeechUtteranceDefaultSpeechRate * 0.8
        case .usual: return AVSpeechUtteranceDefaultSpeechRate
        case .quick: return AVSpeechUtteranceDefaultSpeechRate * 1.15
        }
    }

    static let storageKey = "speechSpeed"

    static var current: SpeechSpeed {
        SpeechSpeed(rawValue: UserDefaults.standard.string(forKey: storageKey) ?? "") ?? .usual
    }
}

/// Says words aloud with the device's own voices, which work with no internet.
/// Speech is never automatic (PRINCIPLES.md I5): only ever call this from a press.
final class Speaker {
    static let shared = Speaker()

    private let synthesizer = AVSpeechSynthesizer()

    private init() {
        #if !os(watchOS)
        // Speech is played as media, so a silent switch does not mute a child's voice.
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio)
        try? AVAudioSession.sharedInstance().setActive(true)
        #endif
    }

    /// Each new thing said ends whatever was being said before it.
    func speak(_ text: String) {
        synthesizer.stopSpeaking(at: .immediate)
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-GB")
        utterance.rate = SpeechSpeed.current.rate
        synthesizer.speak(utterance)
    }

    func stop() {
        synthesizer.stopSpeaking(at: .immediate)
    }
}
