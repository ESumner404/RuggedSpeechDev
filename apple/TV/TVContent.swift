import Combine
import Foundation

/// The words and settings the television uses. Its own starter words and defaults until the iPad or iPhone has sent
/// its own; after that, the iPad's, which are kept so the television still matches when the iPad is away.
final class TVContent: ObservableObject {
    static let shared = TVContent()

    private static let storageKey = "syncMessage"

    @Published private(set) var sync: SyncMessage?
    @Published private(set) var syncedAt: Date?

    private init() {
        if let json = UserDefaults.standard.string(forKey: Self.storageKey), let saved = SyncMessage.decode(json) {
            sync = saved
            syncedAt = UserDefaults.standard.object(forKey: Self.storageKey + "At") as? Date
            configureVoice(saved)
        }
    }

    func apply(_ json: String) {
        guard let message = SyncMessage.decode(json) else { return }
        UserDefaults.standard.set(json, forKey: Self.storageKey)
        UserDefaults.standard.set(Date(), forKey: Self.storageKey + "At")
        DispatchQueue.main.async {
            self.sync = message
            self.syncedAt = Date()
        }
        configureVoice(message)
    }

    /// Goes back to the television's own starter words and settings.
    func forget() {
        UserDefaults.standard.removeObject(forKey: Self.storageKey)
        UserDefaults.standard.removeObject(forKey: Self.storageKey + "At")
        Speaker.shared.voice = nil
        DispatchQueue.main.async {
            self.sync = nil
            self.syncedAt = nil
        }
    }

    private func configureVoice(_ message: SyncMessage) {
        Speaker.shared.voice = Speaker.Voice(
            rate: message.speech.rate,
            pitch: message.speech.pitch,
            volume: message.speech.volume,
            pronunciations: message.pronunciations.map { ($0.written, $0.spoken) }
        )
    }

    // MARK: What the screens read

    var rootBoard: VocabBoard { board(sync?.root ?? Vocabulary.rootID) ?? Vocabulary.root }

    func board(_ id: String) -> VocabBoard? {
        if let synced = sync?.boards.first(where: { $0.id == id }) { return synced.vocab }
        return sync == nil ? Vocabulary.board(id) : nil
    }

    /// What pressing a word does: add it to the sentence, say it, or both.
    var press: String { sync?.press ?? "sentence" }
    var labels: String { sync?.look.labels ?? "both" }
    var lowArousal: Bool { sync?.look.lowArousal ?? false }
    var textScale: Double { min(2, max(1, sync?.look.textScale ?? 1)) }
    var contrast: String { sync?.look.contrast ?? "off" }
    var clearAfterSpeak: Bool { sync?.clearAfterSpeak ?? false }
    var deviceName: String { sync?.device ?? "" }
}
