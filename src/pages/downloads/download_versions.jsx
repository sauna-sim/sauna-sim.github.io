import {useEffect, useState} from "react";
import {getReleases} from "../../actions/github_actions.js";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import DownloadVersionItem from "./download_version_item.jsx";
import {Skeleton} from "primereact/skeleton";

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

            setTotalRows(totalRecords);
            setReleases(response.data);
            setLoading(false);
        })();
    }, [page, perPage]);

    const handlePageChange = (event) => {
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
                layout={"list"}
                listTemplate={(items) => {
                    if (loading) {
                        const skeletons = [];
                        for (let i = 0; i < perPage; i++) {
                            skeletons.push(
                                <div key={i}>
                                    <div className={"p-3 flex gap-2"}>
                                        <div className={"flex flex-col gap-2"}>
                                            <Skeleton height={"1.2rem"} width={"20rem"}/>
                                            <Skeleton height={"1.2rem"} width={"15rem"}/>
                                        </div>
                                    </div>
                                    <div className={"mx-3"}>
                                        <hr className={"w-full text-gray-400 dark:text-gray-600"}/>
                                    </div>
                                </div>,
                            )
                        }
                        return (
                            <div className={"flex flex-col gap-2"}>
                                {skeletons}
                            </div>
                        );
                    }

                    return (
                        <div className={"flex flex-col gap-2"}>
                            {items.map((item, i) => {
                                return <div key={i}>
                                    <div className={"w-full"}>
                                        <DownloadVersionItem release={item}/>
                                    </div>
                                    <div className={"mx-3"}>
                                        <hr className={"w-full text-gray-400 dark:text-gray-600"}/>
                                    </div>
                                </div>
                            })}
                        </div>
                    )
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