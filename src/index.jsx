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

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <PrimeReactProvider value={{unstyled: true, pt: Tailwind, ptOptions: {mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge}}}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<MainLayout><HomePage /></MainLayout>}/>
                    <Route path={"*"} element={<MainLayout><NotFoundPage /></MainLayout>} />
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)