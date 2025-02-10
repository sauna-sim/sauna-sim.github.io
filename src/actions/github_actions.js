import axios from "axios";
import {OsTypes} from "../utils/os_utils.js";

const githubApiUrl = "https://api.github.com";
const saunaUiRepo = "sauna-sim/sauna-ui";

export async function getLatestRelease() {
    const url = `${githubApiUrl}/repos/${saunaUiRepo}/releases/latest`;

    const response = await axios.get(url);

    return response.data;
}

export const Architecture = {
    x64: {
        key: "x64",
        label: "x86_64 (64-bit)",
        deb: "amd64",
        rpm: "x86_64",
        exe: "x64",
        dmg: "x64",
        standalone: "x64"
    },
    arm64: {
        key: "arm64",
        label: "ARM (64-bit)",
        deb: "arm64",
        rpm: "aarch64",
        exe: "arm64",
        dmg: "aarch64",
        standalone: "arm64"
    }
};

export const DownloadType = {
    deb: {
        key: "deb",
        label: "Debian Package (.deb)"
    },
    rpm: {
        key: "rpm",
        label: "Red Hat Package (.rpm)"
    },
    exe: {
        key: "exe",
        label: "Installer (.exe)"
    },
    dmg: {
        key: "dmg",
        label: "Installer (.dmg)"
    },
    standalone: {
        key: "standalone",
        label: "Standalone (.tar.gz)"
    }
}

export function getDownloadsForRelease(release) {
    const downloads = [];
    for (const asset of release?.assets ?? []) {
        if (asset.name.includes(`Standalone`)) {
            // Determine OS
            let os;
            if (asset.name.includes("win")) {
                os = OsTypes.WINDOWS;
            } else if (asset.name.includes("osx")) {
                os = OsTypes.MACOS;
            } else if (asset.name.includes("linux")) {
                os = OsTypes.LINUX;
            }

            // Determine arch
            let arch;
            for (const [archKey, archValue] of Object.entries(Architecture)) {
                if (asset.name.includes(archValue.standalone)) {
                    arch = archKey;
                    break;
                }
            }

            downloads.push({
                type: DownloadType.standalone.key,
                os: os,
                arch: arch,
                url: asset.browser_download_url,
                size: asset.size,
                primary: os === OsTypes.LINUX
            });
        } else if (asset.name.endsWith(".exe")) {
            // Determine arch
            let arch;
            for (const [archKey, archValue] of Object.entries(Architecture)) {
                if (asset.name.includes(archValue.exe)) {
                    arch = archKey;
                    break;
                }
            }

            downloads.push({
                type: DownloadType.exe.key,
                os: OsTypes.WINDOWS,
                arch: arch,
                url: asset.browser_download_url,
                size: asset.size,
                primary: true
            });
        } else if (asset.name.endsWith(".dmg")) {
            // Determine arch
            let arch;
            for (const [archKey, archValue] of Object.entries(Architecture)) {
                if (asset.name.includes(archValue.dmg)) {
                    arch = archKey;
                    break;
                }
            }

            downloads.push({
                type: DownloadType.dmg.key,
                os: OsTypes.MACOS,
                arch: arch,
                url: asset.browser_download_url,
                size: asset.size,
                primary: true
            });
        } else if (asset.name.endsWith(".deb")) {
            // Determine arch
            let arch;
            for (const [archKey, archValue] of Object.entries(Architecture)) {
                if (asset.name.includes(archValue.deb)) {
                    arch = archKey;
                    break;
                }
            }

            downloads.push({
                type: DownloadType.deb.key,
                os: OsTypes.LINUX,
                arch: arch,
                url: asset.browser_download_url,
                size: asset.size,
                primary: false
            });
        } else if (asset.name.endsWith(".rpm")) {
            // Determine arch
            let arch;
            for (const [archKey, archValue] of Object.entries(Architecture)) {
                if (asset.name.includes(archValue.rpm)) {
                    arch = archKey;
                    break;
                }
            }

            downloads.push({
                type: DownloadType.rpm.key,
                os: OsTypes.LINUX,
                arch: arch,
                url: asset.browser_download_url,
                size: asset.size,
                primary: false
            });
        }
    }

    return downloads;
}

export function getDownloadForRelease(release, os, arch) {
    const downloads = [];

    for (const asset of release?.assets ?? []) {
        // Handle Standalone Package
        if (asset.name.includes(`Standalone-${os}-${Architecture[arch].standalone}`)) {
            downloads.push({
                type: "Standalone Binary",
                url: asset.browser_download_url,
                size: asset.size,
                primary: os === OsTypes.LINUX
            });
        } else {
            switch (os) {
                case OsTypes.WINDOWS:
                    if (asset.name.endsWith(`${Architecture[arch].exe}-setup.exe`)) {
                        downloads.push({
                            type: "Installer (exe)",
                            url: asset.browser_download_url,
                            size: asset.size,
                            primary: true
                        });
                    }
                    break;
                case OsTypes.MACOS:
                    if (asset.name.endsWith(`${Architecture[arch].dmg}.exe`)) {
                        downloads.push({
                            type: "Installer (dmg)",
                            url: asset.browser_download_url,
                            size: asset.size,
                            primary: true
                        });
                    }
                    break;
                case OsTypes.LINUX:
                    if (asset.name.endsWith(`${Architecture[arch].rpm}.rpm`)) {
                        downloads.push({
                            type: "Red Hat Package (rpm)",
                            url: asset.browser_download_url,
                            size: asset.size,
                            primary: false
                        });
                    } else if (asset.name.endsWith(`${Architecture[arch].deb}.deb`)) {
                        downloads.push({
                            type: "Debian Package (deb)",
                            url: asset.browser_download_url,
                            size: asset.size,
                            primary: false
                        });
                    }
                    break;
            }
        }
    }

    return downloads;
}