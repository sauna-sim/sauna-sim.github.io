import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/home.jsx";
import './assets/style/index.css';
import {PrimeReactProvider} from "primereact/api";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<HomePage/>}/>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)