import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Card, Grid, Tooltip, Button } from "@mui/material";
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

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}

export default function Dashboard() {
    const navigate = useNavigate();

    // const [errorMessage, setErrorMessage] = useState(null);
    const { height, width } = useWindowDimensions();

    // time periods for summary counters:
    const [dayStart, setDayStart] = useState(null);
    const [dayEnd, setDayEnd] = useState(null);

    const [weekStart, setWeekStart] = useState(null);
    const [weekEnd, setWeekEnd] = useState(null);

    const [monthStart, setMonthStart] = useState(null);
    const [monthEnd, setMonthEnd] = useState(null);

    const [yearStart, setYearStart] = useState(null);
    const [yearEnd, setYearEnd] = useState(null);

    const [barChartDates, setBarChartDates] = useState(["01.01", "02.01", "03.01", "04.01"]);
    const [barChartSummaries, setBarChartSummaries] = useState([5, -5, 2, -2]);

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
    const [yearSummary, setYearSummary] = useState(emptySummary);

    // currency information:
    const [currency, setCurrency] = useState();
    const [currencySymbol, setCurrencySymbol] = useState("");

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

        setYearStart(new Date()); // todo
        setYearEnd(new Date()); // todo
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
        {
            name: "This year",
            start_time: yearStart,
            end_time: yearEnd,

            summary: yearSummary,
            set_summary: setYearSummary,
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
            return;
        }

        let groshi = new GroshiAPIClient(token);

        // fetch and set summaries:
        for (let i = 0; i < periods.length; i++) {
            groshi
                .transactionsSummary(currency, periods[i].start_time, periods[i].end_time)
                .then((resp) => {
                    periods[i].set_summary({
                        income: resp.income / 100,
                        outcome: resp.outcome / 100,
                        total: resp.total / 100,
                        transactions_count: resp.transactions_count,
                    });
                })
                .catch((e) => {
                    console.log(
                        "Error while fetching '" + periods[i].name + "' summary: " + e.toString()
                    );
                });
        }
    }, deps);

    useEffect(() => {
        // ensure that month start and month end have been set
        if (!monthStart || !monthEnd) {
            return;
        }

        let token = localStorage.getItem("token");
        if (!token) {
            navigate(routes.LOGIN_ROUTE);
            return;
        }
        // let groshi = new GroshiAPIClient(token);
        // groshi
        //     .transactionReadMany(monthStart.toISOString(), monthEnd.toISOString())
        //     .then((resp) => {
        //         let monthDays = {};
        //
        //         for (let i = 0; i < resp.length; i++) {
        //             let transactionDay = new Date(resp.timestamp).getDay();
        //             if (monthDays.hasOwnProperty(transactionDay)) {
        //             } else {
        //                 monthDays[transactionDay] = resp.amount;
        //             }
        //         }
        //     })
        //     .catch((e) => {
        //         console.log("Error while fetching transactions: " + e.toString());
        //     });
    }, [monthStart, monthEnd]);
    // let days = [];
    // let values = [];
    //
    // for (let i = 1; i < 31; i++) {
    //     days.push(i + ".01");
    //     // values.push(randomNumberBetween(2 * i * i * 5, -100, 100)());
    // }
    // values.push(1);

    return (
        <Box mt={2}>
            <Grid container spacing={4}>
                {periods.map((period) => (
                    <Grid key={period.name} item xs={12} md={3} textAlign="center">
                        <Typography variant="h2" fontWeight="normal">
                            {
                                // place "-" sign before the currency symbol if the summary amount is negative:
                                period.summary.total >= 0
                                    ? currencySymbol + period.summary.total
                                    : "-" + currencySymbol + -period.summary.total
                            }
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
