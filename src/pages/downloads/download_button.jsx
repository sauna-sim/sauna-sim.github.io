import {useState} from "react";
import {SplitButton} from "primereact/splitbutton";
import {Architecture, DownloadType} from "../../actions/github_actions.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudDownload} from "@fortawesome/free-solid-svg-icons/faCloudDownload";
import {useNavigate} from "react-router";

const DownloadButton = ({type, downloads, primary, defaultArch}) => {
    const [arch, setArch] = useState(defaultArch);
    const navigate = useNavigate();

    const onDownloadClick = (downloadUrl) => {
        const params = new URLSearchParams({
            url: downloadUrl
        }).toString();
        navigate(`/downloads/started?${params}`);
    }

    const archOptions = downloads.map((dload) => ({
        id: dload.arch,
        label: Architecture[dload.arch].label,
        command: () => {
            setArch(dload.arch);
            onDownloadClick(dload.url);
        }
    }));

    const downloadUrl = downloads.find((dload) => dload.arch === arch).url;

    return <SplitButton
        label={<div>
            <div>{DownloadType[type].label}</div>
            <small>{Architecture[arch]?.label}</small>
        </div>}
        icon={(options) => <FontAwesomeIcon icon={faCloudDownload} {...options.iconProps} />}
        buttonClassName={"w-full"}
        className={"w-full"}
        model={archOptions}
        outlined={!primary}
        severity={primary ? "success": null}
        onClick={() => onDownloadClick(downloadUrl)}
    />;
}

export default DownloadButton;