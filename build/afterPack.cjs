// Runs after the app is packed, before it is signed or put in an installer.
// It switches off the parts of the Electron program that an app like this
// never needs and that could be used to run something other than the app:
//   - running the program as a plain Node command (RunAsNode)
//   - Node options set from the environment (NODE_OPTIONS)
//   - the Node debug port (--inspect), in the Windows release build
//   - loading app code from anywhere but the packed app file
// The Mac build is only for developing and testing (the end-to-end tests drive
// the real app through the debug port), so it keeps that one port. The
// Windows build, the one a child uses, does not.
const path = require('node:path');
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');

exports.default = async function afterPack(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  const name = packager.appInfo.productFilename;
  const target =
    electronPlatformName === 'darwin'
      ? path.join(appOutDir, `${name}.app`)
      : electronPlatformName === 'win32'
        ? path.join(appOutDir, `${name}.exe`)
        : path.join(appOutDir, name);
  const release = electronPlatformName === 'win32';

  await flipFuses(target, {
    version: FuseVersion.V1,
    resetAdHocDarwinSignature: electronPlatformName === 'darwin',
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: !release,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
    [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
  });
};
