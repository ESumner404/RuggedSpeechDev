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

    /// The device's own playlists that have at least one song stored on the device, by name.
    func playlists() -> [[String: Any]] {
        guard MPMediaLibrary.authorizationStatus() == .authorized else { return [] }
        let collections = MPMediaQuery.playlists().collections ?? []
        return collections.compactMap { collection -> [String: Any]? in
            guard let playlist = collection as? MPMediaPlaylist else { return nil }
            let stored = playlist.items.filter { !$0.isCloudItem }
            guard !stored.isEmpty else { return nil }
            return ["id": String(playlist.persistentID), "name": playlist.name ?? "Playlist", "count": stored.count]
        }
        .sorted { ($0["name"] as? String ?? "").localizedCaseInsensitiveCompare($1["name"] as? String ?? "") == .orderedAscending }
    }

    /// The songs stored on the device, by title. Of one playlist, and/or matching a search of the title or artist.
    func list(playlistId: String?, search: String?, limit: Int = 1000) -> [[String: Any]] {
        guard MPMediaLibrary.authorizationStatus() == .authorized else { return [] }
        var items: [MPMediaItem]
        if let playlistId = playlistId, let identifier = UInt64(playlistId) {
            let query = MPMediaQuery.playlists()
            query.addFilterPredicate(MPMediaPropertyPredicate(value: NSNumber(value: identifier), forProperty: MPMediaPlaylistPropertyPersistentID))
            items = (query.collections?.first as? MPMediaPlaylist)?.items ?? []
        } else {
            items = MPMediaQuery.songs().items ?? []
        }
        items = items.filter { !$0.isCloudItem }
        if let search = search?.trimmingCharacters(in: .whitespaces), !search.isEmpty {
            items = items.filter {
                ($0.title ?? "").localizedCaseInsensitiveContains(search) || ($0.artist ?? "").localizedCaseInsensitiveContains(search)
            }
        }
        // A playlist keeps its own order; everything else is by title.
        if playlistId == nil {
            items.sort { ($0.title ?? "").localizedCaseInsensitiveCompare($1.title ?? "") == .orderedAscending }
        }
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
