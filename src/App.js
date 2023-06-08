import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import Settings from "./components/Settings";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SignUp from "./components/SignUp";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

export default function App() {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="sign-in" element={<SignIn />} />
                    <Route path="sign-up" element={<SignUp />} />

                    <Route index element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
