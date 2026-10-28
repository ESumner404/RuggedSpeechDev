import AVKit
import PhotosUI
import UIKit
import UniformTypeIdentifiers

/// Movies kept on the device, played by the device, and nothing to do with the internet.
///
/// An adult picks videos from Photos or Files; each is copied into the app's own folder, so it plays with no
/// internet and keeps playing if the original is taken off the device. The page keeps only a name for each, and asks
/// to play one when someone presses it. Nothing is sent anywhere. (Films bought or rented in the TV app are locked to
/// that app and cannot be added.)
final class MovieLibrary: NSObject, PHPickerViewControllerDelegate, UIDocumentPickerDelegate {
    static let shared = MovieLibrary()

    private static let maxBytes: Int64 = 4_000_000_000
    private var pending: (([[String: Any]]) -> Void)?

    private var folder: URL {
        let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("Movies", isDirectory: true)
        try? FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
        return url
    }

    /// Only a name this class made: a UUID and an extension. Nothing the page sends can name another file.
    private func file(for id: String) -> URL? {
        guard id.range(of: "^[0-9A-Fa-f-]{36}\\.[A-Za-z0-9]{1,5}$", options: .regularExpression) != nil else { return nil }
        let url = folder.appendingPathComponent(id)
        return FileManager.default.fileExists(atPath: url.path) ? url : nil
    }

    // MARK: Choosing

    func pick(source: String, from controller: UIViewController, done: @escaping ([[String: Any]]) -> Void) {
        guard pending == nil else { done([]); return }
        pending = done
        if source == "files" {
            let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.movie, .video], asCopy: true)
            picker.allowsMultipleSelection = true
            picker.delegate = self
            controller.present(picker, animated: true)
        } else {
            var configuration = PHPickerConfiguration(photoLibrary: .shared())
            configuration.filter = .videos
            configuration.selectionLimit = 10
            configuration.preferredAssetRepresentationMode = .current
            let picker = PHPickerViewController(configuration: configuration)
            picker.delegate = self
            controller.present(picker, animated: true)
        }
    }

    private func finish(_ added: [[String: Any]]) {
        let done = pending
        pending = nil
        DispatchQueue.main.async { done?(added) }
    }

    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard !results.isEmpty else { finish([]); return }
        let group = DispatchGroup()
        let lock = NSLock()
        var added: [[String: Any]] = []
        for result in results {
            group.enter()
            let provider = result.itemProvider
            provider.loadFileRepresentation(forTypeIdentifier: UTType.movie.identifier) { url, _ in
                defer { group.leave() }
                guard let url = url, let entry = self.copyIn(url, title: provider.suggestedName) else { return }
                lock.lock(); added.append(entry); lock.unlock()
            }
        }
        group.notify(queue: .main) { self.finish(added) }
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        let added = urls.compactMap { copyIn($0, title: $0.deletingPathExtension().lastPathComponent) }
        for url in urls { try? FileManager.default.removeItem(at: url) }
        finish(added)
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) { finish([]) }

    /// Copies a chosen video into the app's folder under a name of our own, and says what it is.
    private func copyIn(_ source: URL, title: String?) -> [String: Any]? {
        let size = (try? source.resourceValues(forKeys: [.fileSizeKey]).fileSize).map { Int64($0) } ?? 0
        guard size > 0, size <= Self.maxBytes else { return nil }
        let ext = source.pathExtension.lowercased().range(of: "^[a-z0-9]{1,5}$", options: .regularExpression) != nil ? source.pathExtension.lowercased() : "mov"
        let id = UUID().uuidString + "." + ext
        var destination = folder.appendingPathComponent(id)
        do {
            try FileManager.default.copyItem(at: source, to: destination)
            var values = URLResourceValues()
            values.isExcludedFromBackup = true
            try? destination.setResourceValues(values)
        } catch {
            return nil
        }
        let seconds = CMTimeGetSeconds(AVURLAsset(url: destination).duration)
        return [
            "id": id,
            "title": (title ?? "Movie").trimmingCharacters(in: .whitespaces),
            "bytes": size,
            "seconds": seconds.isFinite ? Int(seconds) : 0,
        ]
    }

    // MARK: Playing and removing

    func play(id: String, from controller: UIViewController) -> Bool {
        guard let url = file(for: id) else { return false }
        let player = AVPlayer(url: url)
        let viewController = AVPlayerViewController()
        viewController.player = player
        viewController.modalPresentationStyle = .fullScreen
        controller.present(viewController, animated: true) { player.play() }
        return true
    }

    func remove(id: String) {
        if let url = file(for: id) { try? FileManager.default.removeItem(at: url) }
    }
}
