import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import GroshiAPIClient from "../groshi";
import * as routes from "../routes";

const columns = [
    // hidden fields:
    { field: "id", type: "string" }, // required internal `id` field

    { field: "created_at", type: "date" },
    { field: "updated_at", type: "date" },
    // public fields:
    { field: "date", type: "date", headerName: "Date", editable: true },
    { field: "amount", type: "number", headerName: "Amount", editable: true },
    { field: "currency", type: "string", headerName: "Currency", editable: true },
    {
        field: "description",
        type: "string",
        headerName: "Description",
        editable: true,
        sortable: false,
        width: 500,
    },
];


export default function Transactions() {
    let navigate = useNavigate();

    let [rows, setRows] = useState([]);

    let [startTime, setStartTime] = useState(null);
    let [endTime, setEndTime] = useState(null);
    let [currency, setCurrency] = useState(null);

    useEffect(() => {
        setStartTime(new Date(2004, 0, 1, 0, 0, 0, 0));
        setEndTime(new Date());
    }, []);

    useEffect(() => {
        // ensure that `startTime` and `endTime` are set. Note: `currency` is an optional dependency:
        if (startTime === null || endTime === null) {
            return;
        }

        let token = localStorage.getItem("token");
        if (!token) {
            navigate(routes.LOGIN_ROUTE);
            return;
        }
        let groshi = new GroshiAPIClient(token);
        groshi
            .transactionReadMany(startTime, endTime)
            .then((transactions) => {
                console.log(startTime, endTime, transactions);
                for (let i = 0; i < transactions.length; i++) {
                    let transaction = transactions[i];
                    let row = {
                        id: transaction.uuid,

                        created_at: new Date(transaction.created_at),
                        updated_at: new Date(transaction.updated_at),

                        date: new Date(transaction.timestamp),
                        amount: transaction.amount / 100,
                        currency: transaction.currency,
                        description: transaction.description,
                    };
                    setRows((rows) => [...rows, row]); // append row to rows
                }
            })
            .catch((e) => {
                console.log("Error fetching transactions: " + e.toString());
            });
    }, [startTime, endTime, currency]);

    return (
        <Box>
            <span>{rows.length}</span>
            <DataGrid
                columns={columns}
                rows={rows}
                columnVisibilityModel={{
                    id: false,
                    created_at: false,
                    updated_at: false,
                }}
            />
        </Box>
    );
}
