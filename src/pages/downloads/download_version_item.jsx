import {useEffect, useState} from "react";
import {Architecture, DownloadType, getDownloadsForRelease} from "../../actions/github_actions.js";
import moment from "moment";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons/faDownload";
import {Dropdown} from "primereact/dropdown";
import {getOs, OsTypes} from "../../utils/os_utils.js";
import {FloatLabel} from "primereact/floatlabel";
import {Dialog} from "primereact/dialog";

const DownloadVersionItem = ({release}) => {
    const [os, setOs] = useState(null);
    const [arch, setArch] = useState(null);
    const [type, setType] = useState(null);
    const [optionsMap, setOptionsMap] = useState({});
    const [showDownloadDialog, setShowDownloadDialog] = useState(false);

    useEffect(() => {
        const newOptionsMap = {};

        for (const download of getDownloadsForRelease(release)) {
            if (!newOptionsMap[download.os]) {
                newOptionsMap[download.os] = {};
            }

            if (!newOptionsMap[download.os][download.arch]) {
                newOptionsMap[download.os][download.arch] = {};
            }

            newOptionsMap[download.os][download.arch][download.type] = download;
        }

        const detectedOs = getOs();
        if (newOptionsMap[detectedOs]) {
            setOs(detectedOs);
            const newArch = os === OsTypes.MACOS ? Architecture.arm64.key : Architecture.x64.key;
            setArch(newArch);
            const typeEntries= Object.entries(newOptionsMap[detectedOs][newArch]);
            const newType = typeEntries.find(([key, value]) => value.primary)?.[0] ?? typeEntries[0][0];
            setType(newType);
        }

        setOptionsMap(newOptionsMap);
    }, []);

    const osOptions = Object.keys(optionsMap).map(key => {
        switch (key) {
            case OsTypes.WINDOWS:
                return {value: key, label: "Windows"};
            case OsTypes.MACOS:
                return {value: key, label: "Mac OS"};
            case OsTypes.LINUX:
                return {value: key, label: "Linux"};
            default:
                return {value: key, label: key};
        }
    });

    const archOptions = optionsMap[os] ? Object.keys(optionsMap[os]).map(key => ({
        label: Architecture[key]?.label,
        value: key
    })) : [];

    const typeOptions = optionsMap[os]?.[arch] ? Object.keys(optionsMap[os][arch]).map(key => ({
        label: DownloadType[key]?.label,
        value: key
    })) : [];

    const publishDate = moment(release.published_at);
    const asset = optionsMap[os]?.[arch]?.[type];

    return (
        <div className={"p-3 flex flex-row gap-2"}>
            <div className={"flex flex-col gap-2"}>
                <a href={release.html_url} target={"_blank"}>
                    <h1 className={"text-2xl font-bold"}>{release.name}</h1>
                </a>
                <h3 className={"text-md text-gray-600 dark:text-gray-400"}>{publishDate.calendar()}</h3>
            </div>
            <div
                className={"flex-grow-1 flex flex-col items-end md:flex-row md:items-center md:justify-end px-3 gap-2"}>
                <Button
                    outlined={true}
                    icon={(options) => <FontAwesomeIcon icon={faDownload} {...options.iconProps} />}
                    onClick={() => setShowDownloadDialog(true)}
                />
            </div>
            <Dialog
                style={{width: "30rem"}}
                visible={showDownloadDialog}
                onHide={() => setShowDownloadDialog(false)}
                header={`Download Release ${release.name}`}
                dismissableMask={true}
            >
                <div className={"flex flex-col gap-2"}>
                    <label>Operating System</label>
                    <Dropdown
                        pt={{root: () => ({className: "md:w-full"})}}
                        options={osOptions}
                        value={os}
                        onChange={(e) => {
                            setOs(e.value);

                            const newArch = e.value === OsTypes.MACOS ? Architecture.arm64.key : Architecture.x64.key;
                            setArch(newArch);

                            const typeEntries= Object.entries(optionsMap[e.value][newArch]);
                            const newType = typeEntries.find(([key, value]) => value.primary)?.[0] ?? typeEntries[0][0];
                            setType(newType);
                        }}
                    />

                    <label>Architecture</label>
                    <Dropdown
                        pt={{root: () => ({className: "md:w-full"})}}
                        value={arch}
                        onChange={(e) => setArch(e.value)}
                        options={archOptions}
                    />

                    <label>Download Type</label>
                    <Dropdown
                        pt={{root: () => ({className: "md:w-full"})}}
                        value={type}
                        onChange={(e) => setType(e.value)}
                        options={typeOptions}
                    />
                    <Button
                        className={"w-full mt-5"}
                        disabled={!asset}
                        icon={(options) => <FontAwesomeIcon icon={faDownload} {...options.iconProps} />}
                        label={"Download"}
                        iconPos={"right"}
                        />
                </div>
            </Dialog>
        </div>
    )
}

export default DownloadVersionItem;