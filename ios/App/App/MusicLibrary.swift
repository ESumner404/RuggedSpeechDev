import Foundation
import MediaPlayer

/// Songs already stored on the device, in its Music library, played by the device itself.
///
/// Only songs that are stored on the device are offered, because a song that is only in the cloud needs the internet and
/// this app never uses it. Nothing is copied out of the library and nothing is sent anywhere. The page keeps only the
/// device's identifier for each song, and asks to play it when someone presses it.
final class MusicLibrary {
    static let shared = MusicLibrary()

    private let player = MPMusicPlayerController.applicationMusicPlayer

    /// Asks to see the library (the first time the device asks the adult), and says what the answer is.
    func access(_ done: @escaping (String) -> Void) {
        MPMediaLibrary.requestAuthorization { status in
            let name: String
            switch status {
            case .authorized: name = "granted"
            case .denied: name = "denied"
            case .restricted: name = "restricted"
            default: name = "notDetermined"
            }
            DispatchQueue.main.async { done(name) }
        }
    }

    /// The songs stored on the device, by title.
    func list(limit: Int = 500) -> [[String: Any]] {
        guard MPMediaLibrary.authorizationStatus() == .authorized else { return [] }
        let query = MPMediaQuery.songs()
        query.addFilterPredicate(MPMediaPropertyPredicate(value: false, forProperty: MPMediaItemPropertyIsCloudItem))
        let items = (query.items ?? []).sorted { ($0.title ?? "").localizedCaseInsensitiveCompare($1.title ?? "") == .orderedAscending }
        return items.prefix(limit).map { item in
            [
                "id": String(item.persistentID),
                "title": item.title ?? "Song",
                "artist": item.artist ?? "",
            ]
        }
    }

    func play(id: String) -> Bool {
        guard MPMediaLibrary.authorizationStatus() == .authorized, let identifier = UInt64(id) else { return false }
        let query = MPMediaQuery.songs()
        query.addFilterPredicate(MPMediaPropertyPredicate(value: NSNumber(value: identifier), forProperty: MPMediaItemPropertyPersistentID))
        guard let item = query.items?.first, !item.isCloudItem else { return false }
        player.setQueue(with: MPMediaItemCollection(items: [item]))
        player.play()
        return true
    }

    func pause() { player.pause() }
    func resume() { player.play() }
    func stop() { player.stop() }

    var state: String {
        switch player.playbackState {
        case .playing: return "playing"
        case .paused: return "paused"
        default: return "stopped"
        }
    }
}
