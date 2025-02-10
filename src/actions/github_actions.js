import axios from "axios";
import {OsTypes} from "../utils/os_utils.js";

const githubApiUrl = "https://api.github.com";
const saunaUiRepo = "sauna-sim/sauna-ui";

export async function getLatestRelease() {
    const url = `${githubApiUrl}/repos/${saunaUiRepo}/releases/latest`;

    const response = await axios.get(url);

    return response.data;
}

const Architecture = {
    x64: {
        deb: "amd64",
        rpm: "x86_64",
        exe: "x64",
        dmg: "x64",
        standalone: "x64"
    },
    arm64: {
        deb: "arm64",
        rpm: "aarch64",
        exe: "arm64",
        dmg: "aarch64",
        standalone: "arm64"
    }
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