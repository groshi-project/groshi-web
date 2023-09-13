import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Card, Grid, Tooltip, Button } from "@mui/material";
import GroshiClient from "../groshi";
import { DataGrid } from "@mui/x-data-grid";

import * as routes from "../routes";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

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
        width: 150,
        editable: true,
    },
    {
        field: "currency",
        headerName: "Currency",
        editable: true,
        description: "Currency",
        width: 100,
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

export default function Dashboard() {
    const navigate = useNavigate();

    // const [errorMessage, setErrorMessage] = useState(null);
    // const [rows, setRows] = useState([]);

    // periods:
    const [dayStart, setDayStart] = useState(null);
    const [dayEnd, setDayEnd] = useState(null);

    const [weekStart, setWeekStart] = useState(null);
    const [weekEnd, setWeekEnd] = useState(null);

    const [monthStart, setMonthStart] = useState(null);
    const [monthEnd, setMonthEnd] = useState(null);

    // summaries:
    // emptySummary is used as placeholder while fetching actual summaries
    const emptySummary = {
        income: 0,
        outcome: 0,
        total: 0,
        transactions_count: 0,
    };
    const [daySummary, setDaySummary] = useState(emptySummary);
    const [weekSummary, setWeekSummary] = useState(emptySummary);
    const [monthSummary, setMonthSummary] = useState(emptySummary);

    // currency information:
    const [currency, setCurrency] = useState();
    const [currencySymbol, setCurrencySymbol] = useState(" ");

    // fetch currency information:
    useEffect(() => {
        // todo: fetch currency from settings
        setCurrency("USD");
        setCurrencySymbol("$");
    }, []);

    // calculate necessary time periods:
    useEffect(() => {
        let date = new Date();
        setDayStart(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        setDayEnd(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));

        setWeekStart(new Date()); // todo
        setWeekEnd(new Date()); // todo

        setMonthStart(new Date(date.getFullYear(), date.getMonth(), 1));
        setMonthEnd(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    }, []);

    let periods = [
        {
            name: "Today",
            start_time: dayStart,
            end_time: dayEnd,

            summary: daySummary,
            set_summary: setDaySummary,
        },
        {
            name: "This week",
            start_time: weekStart, // todo
            end_time: weekEnd, // todo

            summary: weekSummary,
            set_summary: setWeekSummary,
        },
        {
            name: "This month",
            start_time: monthStart,
            end_time: monthEnd,

            summary: monthSummary,
            set_summary: setMonthSummary,
        },
    ];

    // fetch summaries:
    let deps = [currency]; // dependencies for this effect
    for (let i = 0; i < periods.length; i++) {
        deps.push(periods[i].start_time, periods[i].end_time);
    }
    useEffect(() => {
        // ensure that all deps are not null:
        for (let i = 0; i < deps.length; i++) {
            if (deps[i] === null) {
                return;
            }
        }

        let token = localStorage.getItem("token");
        if (!token) {
            navigate(routes.LOGIN_ROUTE);
        }

        let groshi = new GroshiClient(token);

        // fetch and set summaries:
        for (let i = 0; i < periods.length; i++) {
            groshi
                .transactionsSummary(
                    currency,
                    periods[i].start_time.toISOString(),
                    periods[i].end_time.toISOString()
                )
                .then((resp) => {
                    periods[i].set_summary({
                        income: resp.income / 100,
                        outcome: resp.outcome / 100,
                        total: resp.total / 100,
                        transactions_count: resp.transactions_count,
                    });
                })
                .catch((e) => {
                    console.log("Error while fetching '" + periods[i].name + "' summary: " + e);
                });
        }
    }, deps);

    return (
        <Box>
            <Grid container spacing={4}>
                {periods.map((period) => (
                    <Grid key={period.name} item xs={12} md={4} textAlign="center">
                        <Typography variant="h2" fontWeight="normal">
                            {currencySymbol}
                            {period.summary.total}
                        </Typography>
                        <Typography variant="subtitle2">
                            <span color="green" style={{ color: "green" }}>
                                +{currencySymbol}
                                {period.summary.income}
                            </span>
                            <span>, </span>
                            <span style={{ color: "red" }}>
                                -{currencySymbol}
                                {period.summary.outcome}
                            </span>
                        </Typography>
                        <Typography variant="subtitle1">
                            <b>{period.name}</b>{" "}
                            <Tooltip title="Transactions count">
                                <span>({period.summary.transactions_count})</span>
                            </Tooltip>
                        </Typography>
                    </Grid>
                ))}

                {/*<Grid item xs={12} md={12} mt={10}>*/}
                {/*    <Button>123</Button>*/}
                {/*</Grid>*/}

                {/*<Grid item xs={12} md={12} mt={10}>*/}
                {/*    <Box>*/}
                {/*        <Box sx={{ height: 400, width: "100%" }}>*/}
                {/*            <DataGrid*/}
                {/*                rows={rows}*/}
                {/*                columns={columns}*/}
                {/*                initialState={{*/}
                {/*                    pagination: {*/}
                {/*                        paginationModel: {*/}
                {/*                            pageSize: 5,*/}
                {/*                        },*/}
                {/*                    },*/}
                {/*                }}*/}
                {/*                columnVisibilityModel={{*/}
                {/*                    id: false,*/}
                {/*                    created_at: false,*/}
                {/*                    updated_at: false,*/}
                {/*                }}*/}
                {/*                pageSizeOptions={[5]}*/}
                {/*                checkboxSelection*/}
                {/*                disableRowSelectionOnClick*/}
                {/*            />*/}
                {/*        </Box>*/}
                {/*    </Box>*/}
                {/*</Grid>*/}
            </Grid>
        </Box>
    );
}
