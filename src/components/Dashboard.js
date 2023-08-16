import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Card, Grid } from "@mui/material";
import GroshiClient from "../groshi";
import { Sidebar, sidebarWidth } from "./Sidebar";
import { getClosestWeekBeginning } from "../util";
import TopbarUser from "./TopbarUser";
import { DataGrid } from "@mui/x-data-grid";

const DEFAULT_SUMMARY = {
    count: 0,
    income: 0,
    outcome: 0,
    total: 0,
};

const columns = [
    // hidden columns
    { field: "id" },
    { field: "updated_at" },
    { field: "created_at" },
    {
        field: "date",
        type: "date",
        headerName: "Date",
        width: 100,
        editable: true,
    },
    {
        field: "amount",
        type: "number",
        headerName: "Amount",
        width: 100,
        editable: true,
    },
    {
        field: "currency",
        headerName: "Currency",
        editable: true,
        description: "Original currency of transaction",
    },
    {
        field: "description",
        headerName: "Description",
        width: 500,
        editable: true,
        description: "Description of transaction",
        sortable: false,
    },
];

function roundTo(n, place) {
    return +(Math.round(n + "e+" + place) + "e-" + place);
}

function fetchSummary(groshi, since, until, setSummary, setErrorMessage) {
    return groshi
        .sendRequest(
            "/transaction/summary",
            {
                since: since,
                until: until,
            },
            true
        )
        .then((response) => {
            if (!response.success) {
                setErrorMessage(response.error_details);
                return;
            }
            console.log(response);
            response.data.income = roundTo(response.data.income, 2);
            response.data.outcome = roundTo(response.data.outcome, 2);
            response.data.total = roundTo(response.data.total, 2);

            setSummary(response.data);
        });
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);

    const [rows, setRows] = useState([]);

    // Summaries:
    const [daySummary, setDaySummary] = useState(DEFAULT_SUMMARY);
    const [weekSummary, setWeekSummary] = useState(DEFAULT_SUMMARY);
    const [monthSummary, setMonthSummary] = useState(DEFAULT_SUMMARY);

    // Currency:
    // const [currency, setCurrency] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState("$"); // todo

    useEffect(() => {
        let token = localStorage.getItem("token");

        if (!token) {
            navigate("/sign-in");
            return;
        }
    }, []);

    return (
        <Box display="flex">
            <Sidebar />
            <TopbarUser />
            <Box
                textAlign="center"
                mt={10}
                display="flex"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${sidebarWidth}px)` } }}
                component="main"
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight="normal">
                            {daySummary.total}
                            {currencySymbol}
                        </Typography>
                        <Typography variant="subtitle2">
                            (
                            <span color="green" style={{ color: "green" }}>
                                +{daySummary.income}
                                {currencySymbol}
                            </span>
                            <span>, </span>
                            <span style={{ color: "red" }}>
                                {daySummary.outcome}
                                {currencySymbol}
                            </span>
                            )
                        </Typography>
                        <Typography variant="subtitle1">Today</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight={"normal"}>
                            {weekSummary.total}
                            {currencySymbol}
                        </Typography>
                        <Typography variant="subtitle2">
                            (
                            <span color="green" style={{ color: "green" }}>
                                +{weekSummary.income}
                                {currencySymbol}
                            </span>
                            <span>, </span>
                            <span style={{ color: "red" }}>
                                {weekSummary.outcome}
                                {currencySymbol}
                            </span>
                            )
                        </Typography>
                        <Typography variant="subtitle1">This week</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight={"normal"}>
                            {monthSummary.total}
                            {currencySymbol}
                        </Typography>
                        <Typography variant="subtitle2">
                            (
                            <span color="green" style={{ color: "green" }}>
                                +{monthSummary.income}
                                {currencySymbol}
                            </span>
                            <span>, </span>
                            <span style={{ color: "red" }}>
                                {monthSummary.outcome}
                                {currencySymbol}
                            </span>
                            )
                        </Typography>
                        <Typography variant="subtitle1">This month</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} mt={10}>
                        <Box>
                            <Box sx={{ height: 400, width: "100%" }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    columnVisibilityModel={{
                                        id: false,
                                        created_at: false,
                                        updated_at: false,
                                    }}
                                    pageSizeOptions={[5]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
