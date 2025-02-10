
export const OsTypes = {
    WINDOWS: "win",
    MACOS: "osx",
    LINUX: "linux",
    IOS: "ios",
    ANDROID: "android"
};

export function getOs() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = OsTypes.MACOS;
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = OsTypes.IOS;
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = OsTypes.WINDOWS;
    } else if (/Android/.test(userAgent)) {
        os = OsTypes.ANDROID;
    } else if (/Linux/.test(platform)) {
        os = OsTypes.LINUX;
    }

    return os;
}