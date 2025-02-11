import {useEffect, useState} from "react";
import {getReleases} from "../../actions/github_actions.js";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";

const DownloadVersions = () => {
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await getReleases(page + 1, perPage);

            // Get Total Pages
            const lastLink = (response.headers.link?.split(',') ?? []).find((lnk) => lnk.includes("rel=\"last\""));
            const params = new URLSearchParams(lastLink?.substring(lastLink.indexOf("?"), lastLink.indexOf(">")));
            const lastPage = params.has("page") ? Number(params.get("page")) : page + 1;
            let totalRecords = (page * perPage) + response.data.length;

            if (lastPage !== page + 1) {
                totalRecords = lastPage * perPage;
            }
            console.log(totalRecords);
            console.log(lastPage);
            setTotalRows(totalRecords);
            setReleases(response.data);
            setLoading(false);
        })();
    }, [page, perPage]);

    const handlePageChange = (event) => {
        console.log(event);
        setPage(event.page);
        setPerPage(event.rows);
    }

    return (
        <>
            <DataView
                pt={{
                    grid: () => ({className: "rounded-t-md"}),
                    content: () => ({className: "rounded-t-md"})
                }}
                value={releases}
                loading={loading}
                layout={"list"}
                itemTemplate={(item) => {
                    return <>
                        <div className={"w-full p-3 flex gap-2"}>
                            <div className={"flex flex-col gap-2"}>
                                <a href={item.html_url} target={"_blank"}>
                                    <h1 className={"text-2xl font-bold"}>{item.name}</h1>
                                </a>
                                <h3 className={"text-md"}>{new Date(Date.parse(item.published_at)).toLocaleString()}</h3>
                            </div>
                        </div>
                        <hr className={"w-full mx-3 text-gray-400 dark:text-gray-600"}/>
                    </>
                }}
            />
            <Paginator
                pt={{root: () => ({className: "rounded-none rounded-b-md"})}}
                rows={perPage}
                first={page * perPage}
                rowsPerPageOptions={[10, 25, 30, 50, 75, 100]}
                onPageChange={handlePageChange}
                totalRecords={totalRows}
            />
        </>
    )
}

export default DownloadVersions;