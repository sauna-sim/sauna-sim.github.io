import {useEffect} from "react";
import {useSearchParams} from "react-router";

export const DownloadStartedPage = ({}) => {
    let [searchParams] = useSearchParams();
    const url = searchParams.get("url");

    useEffect(() => {
        if (searchParams.has("url")) {
            window.location.href = searchParams.get("url");
        }
    }, []);

    return (
        <div className={"w-full flex flex-col items-center p-15"}>
            <h1 className={"text-3xl dark:text-white"}>Your Download is Starting...</h1>
            <p className={"dark:text-gray-300"}>If the download isn't starting, <a className={"text-underline text-blue-500"} href={url}>click here</a> to start the download manually.</p>
        </div>
    )
}