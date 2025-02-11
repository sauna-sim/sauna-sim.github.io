import {Card} from "primereact/card";
import {useEffect, useState} from "react";
import WindowsLogo from '../assets/images/Windows_logo.svg?react';
import AppleLogo from '../assets/images/Apple_logo_black.svg?react';
import MacOsLogo from '../assets/images/macos-svgrepo-com.svg?react';
import LinuxLogo from "../assets/images/linux-svgrepo-com.svg?react";
import {Architecture, getDownloadsForRelease, getLatestRelease} from "../actions/github_actions.js";
import {OsTypes} from "../utils/os_utils.js";
import DownloadButton from "./downloads/download_button.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare";
import {Button} from "primereact/button";
import DownloadVersions from "./downloads/download_versions.jsx";

const DownloadsPage = () => {
    const [latestRelease, setLatestRelease] = useState(null);

    useEffect(() => {
        (async () => {
            setLatestRelease(await getLatestRelease());
        })();
    }, []);

    const getButtons = (os) => {
        const downloads = getDownloadsForRelease(latestRelease);
        const dloads = {};

        for (const download of downloads) {
            if (download.os === os) {
                if (!dloads[download.type]) {
                    dloads[download.type] = {
                        downloads: []
                    };
                }
                dloads[download.type].downloads.push(download);
                dloads[download.type].primary = download.primary;
            }
        }

        const buttons = [];
        for (const [key, value] of Object.entries(dloads)) {
            if (value.primary) {
                buttons.unshift(<DownloadButton key={key} downloads={value.downloads} type={key}
                                                primary={value.primary} defaultArch={os === OsTypes.MACOS ? Architecture.arm64.key : Architecture.x64.key}/>);
            } else {
                buttons.push(<DownloadButton key={key} downloads={value.downloads} type={key}
                                             primary={value.primary} defaultArch={os === OsTypes.MACOS ? Architecture.arm64.key : Architecture.x64.key}/>);
            }
        }

        return buttons;
    }

    return <div className={"dark:text-white p-10 w-full flex flex-col items-center"}>
        <h1 className={"text-3xl font-bold mx-auto"}>Download Latest SaunaSim Release ({latestRelease?.name})</h1>
        <div className={"grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5 max-w-120 lg:w-full lg:max-w-full"}>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <WindowsLogo/>
                    <h3 className={"text-4xl font-semibold text-black dark:text-white"}>Windows</h3>
                </div>
                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.WINDOWS)}
                    <h3 className={"font-bold align-self-left"}>Notes:</h3>
                    <p className={"text-sm text-gray-600 dark:text-gray-400"}>The Windows app is not currently signed.
                        This means you may get a SmartScreen filter warning when trying to run the application.
                        You will need to click "Allow Anyway" to run the application.</p>
                </div>
            </Card>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <AppleLogo className={"fill-current text-black dark:text-white"}/>
                    <MacOsLogo className={"fill-current text-black dark:text-white mt-4 w-full h-60 lg:h-25"}/>
                </div>

                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.MACOS)}
                    <h3 className={"font-bold align-self-left"}>Notes:</h3>
                    <p className={"text-sm text-gray-600 dark:text-gray-400"}>The MacOS app is not currently signed.
                        This means you may get a popup that prevents the application from running.
                        You will need to go to Settings &#x2192; Privacy and Security and allow SaunaSim to run</p>
                    <p className={"text-sm text-gray-600 dark:text-gray-400"}>Standalone MacOS builds are not signed. This means
                        MacOS will likely block the application from running. It is recommended to use the DMG.</p>
                </div>
            </Card>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <LinuxLogo />
                    <h3 className={"text-4xl font-semibold text-black dark:text-white"}>Linux</h3>
                </div>

                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.LINUX)}
                </div>

                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    <h3 className={"text-2xl"}>Other Packages</h3>
                    <Button
                        className={"w-full"}
                        icon={(options) => <FontAwesomeIcon icon={faArrowUpRightFromSquare} {...options.iconProps} />}
                        label={"Arch User Repository (AUR)"}
                        outlined={true}
                        iconPos={"right"}
                        onClick={() => window.open("https://aur.archlinux.org/packages/sauna-sim", "_blank")}
                    />
                </div>
            </Card>
        </div>

        <h3 className={"mt-10 text-2xl font-bold"}>All Versions</h3>
        <div className={"w-full mt-3"}>
            <DownloadVersions/>
        </div>
    </div>
}

export default DownloadsPage;