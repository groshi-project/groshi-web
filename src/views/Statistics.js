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
    SETTINGS_WEEK_FIRST_DAY,
    TOKEN,
} from "../localStorageKeys";
import * as dateutil from "../utils/period";
import { setPath } from "../utils/history";
import { SETTINGS_ROUTE, STATISTICS_ROUTE } from "../routes";
import {pastNMonths} from "../utils/period";

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

const SummariesRow = ({groshi, primaryCurrency}) => {
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

    // const [periods, setPeriods] = useState(null);
    // periods:
    const [dayStart, setDayStart] = useState(null);
    const [dayEnd, setDayEnd] = useState(null);
    const [weekStart, setWeekStart] = useState(null);
    const [weekEnd, setWeekEnd] = useState(null);
    const [monthStart, setMonthStart] = useState(null);
    const [monthEnd, setMonthEnd] = useState(null);
    const [yearStart, setYearStart] = useState(null);
    const [yearEnd, setYearEnd] = useState(null);

    const [weekFirstDay, setWeekFirstDay] = useState(null);

    const summaries = [
        {
            title: "Today",
            start: dayStart,
            end: dayEnd,

            summary: daySummary,
            setSummary: setDaySummary,
        },
        {
            title: "This week",
            start: weekStart,
            end: weekEnd,

            summary: weekSummary,
            setSummary: setWeekSummary,
        },
        {
            title: "This month",
            start: monthStart,
            end: monthEnd,

            summary: monthSummary,
            setSummary: setMonthSummary,
        },
        {
            title: "This year",
            start: yearStart,
            end: yearEnd,

            summary: yearSummary,
            setSummary: setYearSummary,
        },
    ];

    useEffect(() => {
        let storedWeekFirstDay = localStorage.getItem(SETTINGS_WEEK_FIRST_DAY);
        if (storedWeekFirstDay) {
            setWeekFirstDay(parseInt(storedWeekFirstDay));
        } else {
            setWeekFirstDay(0);
        }
    }, []);

    useEffect(() => {
        if (weekFirstDay === null) {
            return;
        }
        setDayStart(dateutil.dayStart());
        setDayEnd(dateutil.dayEnd());

        setWeekStart(dateutil.weekStart(undefined, weekFirstDay));
        setWeekEnd(dateutil.weekEnd(undefined, weekFirstDay));

        setMonthStart(dateutil.monthStart());
        setMonthEnd(dateutil.monthEnd());

        setYearStart(dateutil.yearStart());
        setYearEnd(dateutil.yearEnd());
    }, [weekFirstDay]);

    // fetch summaries for all periods:
    useEffect(() => {
        if (
            !groshi ||
            !primaryCurrency ||
            !dayStart ||
            !dayEnd ||
            !weekStart ||
            !weekEnd ||
            !monthStart ||
            !monthEnd ||
            !yearStart ||
            !yearEnd
        ) {
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
    }, [
        groshi,
        primaryCurrency,
        dayStart,
        dayEnd,
        weekStart,
        weekEnd,
        monthStart,
        monthEnd,
        yearStart,
        yearEnd,
    ]);

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
                        <b>{summary.title}</b>{" "}
                        <Tooltip title="Transactions count">
                            <span>({summary.summary.transactions_count})</span>
                        </Tooltip>
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}

const PastSixMonthBarChart = ({groshi, primaryCurrency}) => {


    const [months, setMonths] = useState(["", "", "", "", "", ""]);


    const [chartIncomes, setChartIncomes] = useState([0, 0, 0, 0, 0, 0]);
    const [chartOutcomes, setChartOutcomes] = useState([0, 0, 0, 0, 0, 0]);
    // const [chartTotals, setChartTotals] = useState([]);

    // calculate past 6 months:
    useEffect(() => {
        setMonths(pastNMonths(6))
    }, []);

    // fetch summaries for months:
    useEffect(() => {
        if (!groshi || !primaryCurrency.isSet || months.length === 0) {
            return
        }

        for (const month of months) {
            groshi.transactionsSummary(
                primaryCurrency.code, month.start, month.end
            ).then((summary) => {
                setChartIncomes((chartIncomes) => [...chartIncomes, summary.income]);
                setChartOutcomes((chartOutcomes) => [...chartOutcomes, summary.outcome]);
                console.log(chartIncomes)
                console.log(chartOutcomes)

            }).catch((e) => {
                console.error("Failed to fetch summary for", month + ":", e)
            });
        }

    }, [groshi, primaryCurrency, months]);

    return <Box>
        <BarChart
            xAxis={[
                {
                    scaleType: "band",
                    data: months.map(month => month.name),
                },
            ]}
            series={[
                {
                    data: [1, 2, 3, 4, 5, 6],
                    label: "Income",
                    color: "green",
                },
                {
                    data: [1, 2, 3, 4, 5, 6],
                    label: "Outcome",
                    color: "red",
                },
                // {
                //     data: [-413, -10, -99, -39, -236, 449],
                //     label: "Summary",
                //     color: "blue",
                // },
            ]}
            width={600}
            height={300}
        />
    </Box>
}

const StatisticsView = () => {
    const navigate = useNavigate();

    // const { height, width } = useWindowDimensions();
    const [groshi, setGroshi] = useState(null);

    // currency information:
    const [primaryCurrency, setPrimaryCurrency] = useState({ code: "", symbol: "", isSet: false });

    // set URL path:
    useEffect(() => {
        setPath(STATISTICS_ROUTE);
    }, []);

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

        if (code) {
            setPrimaryCurrency({ code: code, symbol: symbol ? symbol : "?", isSet: true });
        } else {
            setPrimaryCurrency({ code: "USD", symbol: "$", isSet: true });
        }
    }, []);

    return (
        <Box mt={2}>
            <SummariesRow groshi={groshi} primaryCurrency={primaryCurrency} />

            <Grid container spacing={4} mt={3}>
                <Grid item md={6} sm={12}>
                    <PastSixMonthBarChart groshi={groshi} primaryCurrency={primaryCurrency} />
                </Grid>
                <Grid item md={6} sm={12}>
                    Second bar chart
                    {/*<BarChart*/}
                    {/*    xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}*/}
                    {/*    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}*/}
                    {/*    width={600}*/}
                    {/*    height={300}*/}
                    {/*/>*/}
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
};

export default StatisticsView;
