#!/usr/bin/env bash
# Builds the iPhone and iPad app for release and uploads it to App Store Connect, where it
# appears in TestFlight once Apple has processed it (a few minutes).
#
# Needs, once, on this Mac (see docs/platforms.md, "TestFlight"):
#   - Xcode signed in to an Apple Developer Program account (Xcode, Settings, Accounts)
#   - an app record in App Store Connect with the bundle identifier in capacitor.config.ts
#
#   APPLE_TEAM_ID=ABCDE12345 npm run ios:testflight          the iPhone and iPad app, with the Apple Watch app inside
#   APPLE_TEAM_ID=ABCDE12345 npm run tvos:testflight         the Apple TV app
set -euo pipefail

TARGET="${1:-ios}"
case "$TARGET" in
  ios) SCHEME="App"; DESTINATION="generic/platform=iOS" ;;
  tvos) SCHEME="RuggedSpeechTV"; DESTINATION="generic/platform=tvOS" ;;
  *) echo "Usage: ios-testflight.sh [ios|tvos]" >&2; exit 2 ;;
esac

cd "$(dirname "$0")/.."
: "${APPLE_TEAM_ID:?Set APPLE_TEAM_ID to your ten-character Apple Developer team ID}"
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"

# Every upload needs a build number higher than the last one.
BUILD_NUMBER="${BUILD_NUMBER:-$(date +%Y%m%d%H%M)}"
ARCHIVE="ios/build/RuggedSpeech-$TARGET.xcarchive"
OPTIONS="ios/build/ExportOptions-$TARGET.plist"

npm run build
npx cap sync ios

rm -rf "$ARCHIVE"
mkdir -p ios/build

# Built unsigned: signing for distribution happens when it is exported, which needs no registered devices
# (building signed would ask for a development profile, and that needs at least one device on the team).
xcodebuild archive \
  -project ios/App/App.xcodeproj \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination "$DESTINATION" \
  -archivePath "$ARCHIVE" \
  CODE_SIGNING_ALLOWED=NO \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

cat > "$OPTIONS" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>upload</string>
  <key>teamID</key><string>$APPLE_TEAM_ID</string>
  <key>signingStyle</key><string>automatic</string>
  <key>uploadSymbols</key><true/>
</dict>
</plist>
PLIST

xcodebuild -exportArchive \
  -archivePath "$ARCHIVE" \
  -exportOptionsPlist "$OPTIONS" \
  -allowProvisioningUpdates

echo "Uploaded the $TARGET build $BUILD_NUMBER. It shows in TestFlight after App Store Connect has processed it."
