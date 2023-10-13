import { BrowserRouter, Route, Routes } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Sidebar from "./components/Sidebar";

import Register from "./views/Register";
import Index from "./views/Index";
import SettingsView from "./views/Settings";
import Login from "./views/Login";
import Statistics from "./views/Statistics";
import Transactions from "./views/Transactions";
import { lightTheme, darkTheme } from "./theme";

import * as routes from "./routes";
import { ThemeProvider } from "@emotion/react";
import { SETTINGS_THEME } from "./localStorageKeys";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";

const WithSidebarLayout = ({ children }) => (
    <div>
        <Sidebar />
        {children}
    </div>
);

export default function App() {
    const [theme, setTheme] = useState(lightTheme);

    const swapTheme = (value) => {
        switch (value) {
            case null:
                setTheme(lightTheme);
                break;
            case "0": // use system preferences
                setTheme(darkTheme);
                break;
            case "1": // light
                setTheme(lightTheme);
                break;
            case "2": // dark
                setTheme(darkTheme);
                break;
        }
    };

    useEffect(() => {
        const value = localStorage.getItem(SETTINGS_THEME);
        swapTheme(value);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route index element={<Index />} />
                    <Route path={routes.LOGIN_ROUTE} element={<Login />} />
                    <Route path={routes.REGISTER_ROUTE} element={<Register />} />

                    <Route element={<WithSidebarLayout />}>
                        <Route path={routes.STATISTICS_ROUTE} element={<Statistics />} />
                        <Route path={routes.TRANSACTIONS_ROUTE} element={<Transactions />} />
                        <Route
                            path={routes.SETTINGS_ROUTE}
                            element={<SettingsView name="name" />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
