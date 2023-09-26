import { BrowserRouter, Route, Routes } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Sidebar from "./components/Sidebar";

import Register from "./views/Register";
import Index from "./views/Index";
import Settings from "./views/Settings";
import Login from "./views/Login";
import Statistics from "./views/Statistics";
import Transactions from "./views/Transactions";

import * as routes from "./routes";

const WithSidebarLayout = ({ children }) => (
    <div>
        <Sidebar />
        {children}
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Index />}></Route>
                <Route path={routes.LOGIN_ROUTE} element={<Login />} />
                <Route path={routes.REGISTER_ROUTE} element={<Register />} />

                <Route element={<WithSidebarLayout />}>
                    <Route path={routes.STATISTICS_ROUTE} element={<Statistics />} />
                    <Route path={routes.TRANSACTIONS_ROUTE} element={<Transactions />} />
                    <Route path={routes.SETTINGS_ROUTE} element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
