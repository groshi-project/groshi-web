import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Card, Grid, Tooltip, Button, Alert } from "@mui/material";
import GroshiAPIClient from "../groshi";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts";

import * as routes from "../routes";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import { randomNumberBetween } from "@mui/x-data-grid/utils/utils";
import ErrorSnackbar from "../components/ErrorSnackbar";
import {
    SETTINGS_PRIMARY_CURRENCY_CODE,
    SETTINGS_PRIMARY_CURRENCY_SYMBOL,
    TOKEN,
} from "../localstorageKeys";
import * as dateutil from "../utils/dateutils";

// function getWindowDimensions() {
//     const { innerWidth: width, innerHeight: height } = window;
//     return {
//         width,
//         height,
//     };
// }

// function useWindowDimensions() {
//     const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
//
//     useEffect(() => {
//         function handleResize() {
//             setWindowDimensions(getWindowDimensions());
//         }
//
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);
//
//     return windowDimensions;
// }

function SummariesRow(props) {
    const { groshi, primaryCurrency } = props;

    const emptySummary = {
        income: 0,
        outcome: 0,
        total: 0,
        transactions_count: 0,
    };

    const [daySummary, setDaySummary] = useState(emptySummary);
    const [weekSummary, setWeekSummary] = useState(emptySummary);
    const [monthSummary, setMonthSummary] = useState(emptySummary);
    const [yearSummary, setYearSummary] = useState(emptySummary);

    const [periods, setPeriods] = useState({
        dayStart: null,
        dayEnd: null,
        weekStart: null,
        weekEnd: null,
        monthStart: null,
        monthEnd: null,
        yearStart: null,
        yearEnd: null,
    });
    useEffect(() => {
        setPeriods({
            dayStart: dateutil.dayStart(),
            dayEnd: dateutil.dayEnd(),

            weekStart: dateutil.weekStart(1), //todo
            weekEnd: dateutil.weekEnd(1), //todo

            monthStart: dateutil.monthStart(),
            monthEnd: dateutil.monthEnd(),

            yearStart: dateutil.yearStart(),
            yearEnd: dateutil.yearEnd(),
        });
    }, []);

    const summaries = [
        {
            title: "Today",
            start: periods.dayStart,
            end: periods.dayEnd,

            summary: daySummary,
            setSummary: setDaySummary,
        },
        {
            title: "This week",
            start: periods.weekStart,
            end: periods.weekEnd,

            summary: weekSummary,
            setSummary: setWeekSummary,
        },
        {
            title: "This month",
            start: periods.monthStart,
            end: periods.monthEnd,

            summary: monthSummary,
            setSummary: setMonthSummary,
        },
        {
            title: "This year",
            start: periods.yearStart,
            end: periods.yearEnd,

            summary: yearSummary,
            setSummary: setYearSummary,
        },
    ];

    // fetch summaries for all periods:
    useEffect(() => {
        if (!groshi || !primaryCurrency) {
            return;
        }
        for (const summary of summaries) {
            groshi
                .transactionsSummary(primaryCurrency.code, summary.start, summary.end)
                .then((resp) => {
                    summary.setSummary({
                        income: resp.income / 100,
                        outcome: resp.outcome / 100,
                        total: resp.total / 100,
                        transactions_count: resp.transactions_count,
                    });
                })
                .catch((e) => {
                    console.error("Error while fetching '" + summary.title + "' summary:", e);
                });
        }
    }, [groshi, primaryCurrency]);

    return (
        <Grid container spacing={4}>
            {summaries.map((summary) => (
                <Grid item key={summary.title} xs={12} md={3} textAlign="center">
                    <Typography variant="h2" fontWeight="normal">
                        {
                            // place "-" sign before the currency symbol if the summary amount is negative:
                            summary.summary.total >= 0
                                ? primaryCurrency.symbol + summary.summary.total
                                : "-" + primaryCurrency.symbol + -summary.summary.total
                        }
                    </Typography>
                    <Typography variant="subtitle2">
                        <span color="green" style={{ color: "green" }}>
                            +{primaryCurrency.symbol}
                            {summary.summary.income}
                        </span>
                        <span>, </span>
                        <span style={{ color: "red" }}>
                            -{primaryCurrency.symbol}
                            {summary.summary.outcome}
                        </span>
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>{summary.name}</b>{" "}
                        <Tooltip title="Transactions count">
                            <span>({summary.summary.transactions_count})</span>
                        </Tooltip>
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}

export default function StatisticsView() {
    const navigate = useNavigate();

    // const { height, width } = useWindowDimensions();
    const [groshi, setGroshi] = useState(null);

    // currency information:
    const [primaryCurrency, setPrimaryCurrency] = useState({ code: "", symbol: "" });

    // initialize groshi:
    useEffect(() => {
        let token = localStorage.getItem(TOKEN);
        if (!token) {
            navigate(routes.LOGIN_ROUTE);
            return;
        }
        setGroshi(new GroshiAPIClient(token));
    }, []);

    // read primary currency:
    useEffect(() => {
        const code = localStorage.getItem(SETTINGS_PRIMARY_CURRENCY_CODE);
        const symbol = localStorage.getItem(SETTINGS_PRIMARY_CURRENCY_SYMBOL);

        if (code && symbol) {
            setPrimaryCurrency({ code: code, symbol: symbol });
        } else {
            setPrimaryCurrency({ code: "USD", symbol: "$" });
        }
    }, []);

    return (
        <Box mt={2}>
            <SummariesRow groshi={groshi} primaryCurrency={primaryCurrency} />

            <Grid container spacing={4} mt={3}>
                <Grid item md={6} sm={12}>
                    <Box>
                        <BarChart
                            xAxis={[
                                {
                                    scaleType: "band",
                                    data: ["January", "February", "March", "April", "May", "June"],
                                },
                            ]}
                            series={[
                                {
                                    data: [543, 902, 745, 925, 613, 964],
                                    label: "Income",
                                    color: "green",
                                },
                                {
                                    data: [955, 912, 912, 964, 849, 515],
                                    label: "Outcome",
                                    color: "red",
                                },
                                {
                                    data: [-413, -10, -99, -39, -236, 449],
                                    label: "Summary",
                                    color: "blue",
                                },
                            ]}
                            width={600}
                            height={300}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={12}>
                    <BarChart
                        xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
                        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                        width={600}
                        height={300}
                    />
                </Grid>
            </Grid>
            {/*<Box style={{ display: "flex", alignItems: "center" }}>*/}
            {/*    <BarChart*/}
            {/*        xAxis={[{ scaleType: "band", data: ["Summary per day"] }]}*/}
            {/*        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}*/}
            {/*        width={width < 800 ? width : width - 200}*/}
            {/*        height={300}*/}
            {/*    />*/}
            {/*</Box>*/}
            {/*<Box>*/}
            {/*    <Box mt={5} textAlign="right">*/}
            {/*        <Button variant="contained" startIcon={<AddIcon />}>*/}
            {/*            Create*/}
            {/*        </Button>*/}
            {/*    </Box>*/}
            {/*    <Box sx={{ height: 400, width: "100%" }} mt={1}>*/}
            {/*        <DataGrid*/}
            {/*            rows={rows}*/}
            {/*            columns={dataGridColumns}*/}
            {/*            initialState={{*/}
            {/*                pagination: {*/}
            {/*                    paginationModel: {*/}
            {/*                        pageSize: 5,*/}
            {/*                    },*/}
            {/*                },*/}
            {/*            }}*/}
            {/*            columnVisibilityModel={{*/}
            {/*                id: false,*/}
            {/*                created_at: false,*/}
            {/*                updated_at: false,*/}
            {/*            }}*/}
            {/*            pageSizeOptions={[5]}*/}
            {/*            checkboxSelection*/}
            {/*            disableRowSelectionOnClick*/}
            {/*        />*/}
            {/*    </Box>*/}
            {/*</Box>*/}
        </Box>
    );
}
