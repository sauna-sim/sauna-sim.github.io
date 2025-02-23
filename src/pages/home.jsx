import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {Architecture, getDownloadForRelease, getLatestRelease} from "../actions/github_actions.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare, faCloudArrowDown} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";
import {getOs, OsTypes} from "../utils/os_utils.js";

const HomePage = () => {
    const [latestRelease, setLatestRelease] = useState(null);
    const [os, setOs] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLatestRelease(await getLatestRelease());
            setOs(getOs());
        })();
    }, []);

    const getDownloadButton = () => {
        if (!os || os === OsTypes.IOS || os === OsTypes.ANDROID) {
            return <Button outlined={true} label={"OS Not Supported"} severity={"warning"} className={"w-full"} disabled={true} />;
        }

        if (os === OsTypes.LINUX) {
            return <Button 
                severity={"success"}
                label={<>
                    Linux Flathub Package
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={"ml-2"}/>
                </>}
                className={"w-full"}
                outlined={true}
                onClick={() => window.open("https://flathub.org/apps/com.saunasim.saunasim", "_blank")}
            />;
        }

        let osName = "Windows";
        switch (os){
            case OsTypes.MACOS:
                osName = "MacOS"
                break;
        }

        const arch = os === OsTypes.MACOS ? Architecture.arm64.key : Architecture.x64.key;
        const archName = Architecture[arch].label;

        const downloadUrl = getDownloadForRelease(latestRelease, os, arch).find((dl) => dl.primary)?.url;

        return <Button severity={"success"}
                       label={<>
                           {osName} {archName} {latestRelease?.name}
                           <FontAwesomeIcon icon={faCloudArrowDown} className={"ml-2"}/>
                       </>}
                       className={"w-full"}
                       outlined={true}
                       onClick={() => window.location.href = downloadUrl}
        />;
    }

    return (
        <div className={"h-full flex flex-col justify-evenly max-w-200 mx-auto"}>
            <Card title={<h1 className={"text-6xl font-bold flex justify-center"}>SaunaSim</h1>}>
                <p className={"text-xl font-bold"}>
                    SaunaSim is an ATC Training tool that simulates an aircraft with a full FMS and autopilot.
                    The aircraft are designed to act as realistically as possible and take into account various factors
                    such as atmospheric and performance data.
                </p>
                <div className={"grid grid-cols-2 gap-4 mt-3"}>
                    {getDownloadButton()}
                    <Button outlined={true}
                            label={"All Downloads"}
                            className={"w-full"}
                            onClick={() => navigate("/downloads")}
                    />
                </div>
            </Card>
        </div>
    )
}

export default HomePage;