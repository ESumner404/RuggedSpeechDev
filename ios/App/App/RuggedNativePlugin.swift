import Capacitor
import UIKit
import UniformTypeIdentifiers

/// The few things the page cannot do for itself inside an iPhone or iPad app:
/// show the share sheet (to save a file where the adult chooses), show the
/// document picker (to open a file the adult chooses), show the print sheet,
/// report the app's version, say which of the device's accessibility settings
/// are on, and give a short buzz. The page never sees a file path. Nothing here
/// uses the network. Mirrors `NativeShell` in src/renderer/platform/nativeBridge.ts.
@objc(RuggedNativePlugin)
public class RuggedNativePlugin: CAPPlugin, CAPBridgedPlugin, UIDocumentPickerDelegate {
    public let identifier = "RuggedNativePlugin"
    public let jsName = "RuggedNative"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "info", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "printPage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "accessibility", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "haptic", returnType: CAPPluginReturnPromise),
    ]

    /// The largest file the app will read: a backup with a great many photographs and songs.
    private static let maxBytes = 700_000_000

    private var pendingOpen: CAPPluginCall?
    private var allowedExtensions: Set<String> = []

    @objc func info(_ call: CAPPluginCall) {
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
        call.resolve(["version": version])
    }

    // MARK: Save: the share sheet, whose "Save to Files" puts it where the adult chooses.

    @objc func saveFile(_ call: CAPPluginCall) {
        guard let data = call.getString("data"), data.utf8.count <= RuggedNativePlugin.maxBytes else {
            call.resolve(["ok": false])
            return
        }
        let name = RuggedNativePlugin.safeFileName(call.getString("name") ?? "", fallback: "rugged-speech.txt")
        let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let file = folder.appendingPathComponent(name)
        do {
            try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            try data.write(to: file, atomically: true, encoding: .utf8)
        } catch {
            call.resolve(["ok": false])
            return
        }
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let controller = self.bridge?.viewController else {
                try? FileManager.default.removeItem(at: folder)
                call.resolve(["ok": false])
                return
            }
            let sheet = UIActivityViewController(activityItems: [file], applicationActivities: nil)
            sheet.completionWithItemsHandler = { _, completed, _, _ in
                try? FileManager.default.removeItem(at: folder)
                call.resolve(["ok": completed])
            }
            // On an iPad the sheet is a popover and needs somewhere to point.
            if let popover = sheet.popoverPresentationController {
                popover.sourceView = controller.view
                popover.sourceRect = CGRect(x: controller.view.bounds.midX, y: controller.view.bounds.midY, width: 0, height: 0)
                popover.permittedArrowDirections = []
            }
            controller.present(sheet, animated: true)
        }
    }

    // MARK: Open: the document picker, copying the chosen file in so nothing stays open outside the app.

    @objc func openFile(_ call: CAPPluginCall) {
        let raw = call.getArray("extensions", String.self) ?? []
        let extensions = raw.filter { $0.range(of: "^[A-Za-z0-9]{1,12}$", options: .regularExpression) != nil }
        guard !extensions.isEmpty, pendingOpen == nil else {
            call.resolve(["ok": false])
            return
        }
        pendingOpen = call
        allowedExtensions = Set(extensions.map { $0.lowercased() })
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let controller = self.bridge?.viewController else {
                self?.finishOpen(ok: false, data: nil)
                return
            }
            // Backups and shared pages have their own file types, which the system
            // does not know, so any file may be chosen and the extension is checked after.
            let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.item], asCopy: true)
            picker.allowsMultipleSelection = false
            picker.delegate = self
            controller.present(picker, animated: true)
        }
    }

    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first, allowedExtensions.contains(url.pathExtension.lowercased()) else {
            finishOpen(ok: false, data: nil)
            return
        }
        defer { try? FileManager.default.removeItem(at: url) }
        let size = (try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? Int.max
        guard size <= RuggedNativePlugin.maxBytes, let text = try? String(contentsOf: url, encoding: .utf8) else {
            finishOpen(ok: false, data: nil)
            return
        }
        finishOpen(ok: true, data: text)
    }

    public func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        finishOpen(ok: false, data: nil)
    }

    private func finishOpen(ok: Bool, data: String?) {
        guard let call = pendingOpen else { return }
        pendingOpen = nil
        allowedExtensions = []
        if let data = data { call.resolve(["ok": ok, "data": data]) } else { call.resolve(["ok": ok]) }
    }

    // MARK: Print: the system print sheet, for the page as it is.

    @objc func printPage(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let webView = self?.bridge?.webView else {
                call.resolve()
                return
            }
            let controller = UIPrintInteractionController.shared
            let printInfo = UIPrintInfo(dictionary: nil)
            printInfo.outputType = .general
            printInfo.jobName = "Rugged Speech"
            controller.printInfo = printInfo
            controller.printFormatter = webView.viewPrintFormatter()
            controller.present(animated: true) { _, _, _ in call.resolve() }
        }
    }

    // MARK: Accessibility: which of the device's own settings are on. Read only, and never sent anywhere.

    @objc func accessibility(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve([
                "reduceMotion": UIAccessibility.isReduceMotionEnabled,
                "increaseContrast": UIAccessibility.isDarkerSystemColorsEnabled,
                "boldText": UIAccessibility.isBoldTextEnabled,
                "textScale": RuggedNativePlugin.textScale(UIApplication.shared.preferredContentSizeCategory),
                "voiceOver": UIAccessibility.isVoiceOverRunning,
                "switchControl": UIAccessibility.isSwitchControlRunning,
                "guidedAccess": UIAccessibility.isGuidedAccessEnabled,
            ])
        }
    }

    /// The device's text size as a multiplier on the usual one. Smaller than usual counts as usual:
    /// the page only ever makes writing larger, never smaller.
    private static func textScale(_ category: UIContentSizeCategory) -> Double {
        switch category {
        case .extraLarge: return 1.1
        case .extraExtraLarge: return 1.25
        case .extraExtraExtraLarge: return 1.5
        case .accessibilityMedium: return 1.5
        case .accessibilityLarge: return 1.75
        case .accessibilityExtraLarge, .accessibilityExtraExtraLarge, .accessibilityExtraExtraExtraLarge: return 2
        default: return 1
        }
    }

    // MARK: Haptic: one short buzz, for a press that should be felt.

    @objc func haptic(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
            call.resolve()
        }
    }

    /// A file name with nothing in it that could name a folder.
    private static func safeFileName(_ value: String, fallback: String) -> String {
        let blocked = CharacterSet(charactersIn: "\\/:*?\"<>|").union(.controlCharacters)
        var cleaned = value.components(separatedBy: blocked).joined(separator: "-")
        while cleaned.hasPrefix(".") { cleaned.removeFirst() }
        cleaned = String(cleaned.prefix(120)).trimmingCharacters(in: .whitespaces)
        return cleaned.isEmpty ? fallback : cleaned
    }
}
