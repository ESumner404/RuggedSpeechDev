import Capacitor
import UIKit

/// The one screen of the app: the page, in a web view that can load nothing
/// else, with the app's own plugin registered beside it.
class RuggedViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(RuggedNativePlugin())
    }

    // The page draws edge to edge and has its own bars; the system's status bar would only take space.
    override var prefersStatusBarHidden: Bool { true }
}
