import {Card} from "primereact/card";
import {useEffect, useState} from "react";
import WindowsLogo from '../assets/images/Windows_logo.svg?react';
import AppleLogo from '../assets/images/Apple_logo_black.svg?react';
import MacOsLogo from '../assets/images/macos-svgrepo-com.svg?react';
import LinuxLogo from "../assets/images/linux-svgrepo-com.svg?react";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudDownload} from "@fortawesome/free-solid-svg-icons/faCloudDownload";
import {Architecture, getDownloadsForRelease, getLatestRelease} from "../actions/github_actions.js";
import {SplitButton} from "primereact/splitbutton";
import {classNames} from "primereact/utils";
import {getOs, OsTypes} from "../utils/os_utils.js";
import DownloadButton from "./downloads/download_button.jsx";

const DownloadsPage = () => {
    const [latestRelease, setLatestRelease] = useState(null);
    const [winInstallerArch, setWinInstallerArch] = useState("x64");
    const [winStandaloneArch, setWinStandaloneArch] = useState("x64");

    useEffect(() => {
        (async () => {
            setLatestRelease(await getLatestRelease());
        })();
    }, []);

    const getArchOptions = (setValueFunc) => (
        Object.entries(Architecture).map(([key, value]) => ({
            id: key,
            label: value.label,
            command: () => setValueFunc(key)
        }))
    );

    const getButtons = (os) => {
        const downloads = getDownloadsForRelease(latestRelease);
        const dloads = {};

        for (const download of downloads) {
            if (download.os === os){
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
            if (value.primary){
                buttons.unshift(<DownloadButton key={key} downloads={value.downloads} type={key} primary={value.primary}/>);
            } else {
                buttons.push(<DownloadButton key={key} downloads={value.downloads} type={key} primary={value.primary}/>);
            }
        }

        return buttons;
    }

    return <div className={"dark:text-white p-10 w-full flex flex-col items-center"}>
        <h1 className={"text-3xl font-bold mx-auto"}>Download Latest SaunaSim Release</h1>
        <div className={"grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5 w-full"}>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <WindowsLogo/>
                    <h3 className={"text-4xl"}>Windows</h3>
                </div>
                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.WINDOWS)}
                </div>
            </Card>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <AppleLogo className={"fill-current text-black dark:text-white"}/>
                    <MacOsLogo className={"fill-current text-black dark:text-white mt-4 w-full h-60 lg:h-25"}/>
                </div>

                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.MACOS)}
                </div>
            </Card>
            <Card>
                <div className={"flex flex-col items-center h-40 gap-4"}>
                    <LinuxLogo/>
                    <h3 className={"text-4xl"}>Linux</h3>
                </div>

                <div className={"mt-10 flex flex-col items-center gap-2"}>
                    {getButtons(OsTypes.LINUX)}
                </div>
            </Card>
        </div>
    </div>
}

export default DownloadsPage;