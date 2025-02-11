import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/home.jsx";
import './assets/style/index.css';
import {PrimeReactProvider} from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import MainLayout from "./layout.jsx";
import {twMerge} from "tailwind-merge";
import NotFoundPage from "./pages/not_found.jsx";
import DownloadsPage from "./pages/downloads.jsx";
import {DownloadStartedPage} from "./pages/downloads/download_started.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <PrimeReactProvider value={{
            unstyled: true,
            pt: Tailwind,
            ptOptions: {mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge}
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<MainLayout />}>
                        <Route index element={<HomePage />}/>
                        <Route path={"downloads"}>
                            <Route index element={<DownloadsPage />} />
                            <Route path={"started"} element={<DownloadStartedPage />} />
                        </Route>
                        <Route path={"*"} element={<NotFoundPage />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)