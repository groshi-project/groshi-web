import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
    randomCreatedDate,
    randomUpdatedDate,
    randomTraderName,
    randomDate,
    randomId,
    randomArrayItem,
} from "@mui/x-data-grid-generator";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import GroshiAPIClient from "../groshi";
import * as routes from "../routes";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as dateutls from "../utils/dateutils";
import ErrorSnackbar from "../components/ErrorSnackbar";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, amount: 0, currency: "", isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "currency" }, //todo
        }));
    };

    return (
        <GridToolbarContainer sx={{ padding: 1 }}>
            <Box>
                <Button startIcon={<AddIcon />} onClick={handleClick}>
                    Add transaction
                </Button>
            </Box>
        </GridToolbarContainer>
    );
}

function TransactionsGrid(props) {
    // todo: use different error message rather than setErrorMessage from Trasactions view
    const { groshi, supportedCurrencies, rows, setRows, setErrorMessage } = props;

    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        for (const row of rows) {
            if (row.id === id) {
                groshi
                    .transactionsDelete(row.uuid)
                    .then((transaction) => {
                        console.log("Deleted transaction:", transaction);
                    })
                    .catch((e) => {
                        setErrorMessage(`Failed to delete transaction: ${e.message}`);
                    });
                break;
            }
        }
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        if (newRow.isNew) {
            // if row was created using CREATE button
            groshi
                .transactionsCreate(
                    Math.round(newRow.amount * 100),
                    newRow.currency,
                    newRow.description,
                    newRow.timestamp
                )
                .then((transaction) => {
                    console.log("Created new transaction:", transaction);
                })
                .catch((e) => {
                    console.log("Error creating new transaction:", e);
                });
        } else {
            // if row was edited using EDIT button
            for (let row of rows) {
                if (row.id === newRow.id) {
                    let newAmount = null;
                    let newCurrency = null;
                    let newDescription = null;
                    let newTimestamp = null;

                    if (newRow.amount !== row.amount) {
                        newAmount = newRow.amount;
                    }
                    if (newRow.currency !== row.currency) {
                        newCurrency = newRow.currency;
                    }
                    if (newRow.description !== row.description) {
                        newDescription = newRow.description;
                    }
                    if (newRow.timestamp !== row.timestamp) {
                        newTimestamp = newRow.timestamp;
                    }
                    groshi
                        .transactionsUpdate(
                            row.uuid,
                            Math.round(newAmount * 100),
                            newCurrency,
                            newDescription,
                            newTimestamp
                        )
                        .then((transaction) => {
                            console.log("Updated transaction:", transaction);
                        })
                        .catch((e) => {
                            console.log("Failed to update transaction", e);
                        });
                    break;
                }
            }
        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            // hidden col
            field: "id",
        },
        {
            // hidden col
            field: "uuid",
            headerName: "UUID",
        },
        {
            field: "date",
            type: "dateTime",
            headerName: "Date",
            editable: true,
            width: 175,
        },
        {
            field: "amount",
            type: "number",
            headerName: "Amount",
            editable: true,
        },
        {
            field: "currency",
            headerName: "Currency",
            type: "singleSelect",
            valueOptions: supportedCurrencies, // todo
            editable: true,
        },
        {
            field: "description",
            headerName: "Description",
            editable: true,
            width: 500,
        },
        // {
        //     // hidden col
        //     field: "created_at",
        //     type: "dateTime",
        //     headerName: "Created at",
        //     width: 175,
        // },
        // {
        //     // hidden col
        //     field: "updated_at",
        //     type: "dateTime",
        //     headerName: "Updated at",
        //     width: 175,
        // },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                } else {
                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />,
                    ];
                }
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: "100%",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                columnVisibilityModel={{
                    id: false, // todo
                    uuid: false, // todo
                    created_at: false, // todo
                    updated_at: false, // todo
                }}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}

const ORIGINAL_CURRENCY = "The original currency";

export default function Transactions() {
    const navigate = useNavigate();

    const [groshi, setGroshi] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const [supportedCurrencies, setSupportedCurrencies] = useState([]);

    // view settings:
    const [currency, setCurrency] = useState(ORIGINAL_CURRENCY);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    // grid props:
    const [rows, setRows] = useState([]);

    // set default startTime and endTime (current month period):
    useEffect(() => {
        let [monthStart, monthEnd] = dateutls.CalculateMonthPeriod();
        setStartTime(monthStart);
        setEndTime(monthEnd);
    }, []);

    // initialize groshi client:
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) {
            navigate(routes.LOGIN_ROUTE);
            return;
        }
        setGroshi(new GroshiAPIClient(token));
    }, []);

    // fetch supported currencies:
    useEffect(() => {
        if (!groshi) {
            return;
        }
        groshi
            .currenciesRead()
            .then((currencies) => {
                setSupportedCurrencies(currencies);
            })
            .catch((e) => {
                console.log("Error fetching supported currencies:", e);
                setErrorMessage(e.toString());
            });
    }, [groshi]);

    // fetch transactions for a given period in a given currency:
    useEffect(() => {
        if (!groshi || !currency || !startTime || !endTime) {
            return;
        }
        groshi
            .transactionsReadMany(
                startTime,
                endTime,
                currency === ORIGINAL_CURRENCY ? undefined : currency // provide `currency` if it is not `ORIGINAL_CURRENCY`, otherwise provide undefined
            )
            .then((transactions) => {
                setRows([]);
                transactions.map((transaction) => {
                    let row = {
                        id: randomId(),

                        uuid: transaction.uuid,
                        date: new Date(transaction.timestamp),
                        amount: transaction.amount / 100,
                        description: transaction.description,
                        currency: transaction.currency,
                    };
                    setRows((rows) => [...rows, row]);
                });
            })
            .catch((e) => {
                setErrorMessage(e.message);
                console.log("Error fetching transactions:", e);
            });
    }, [groshi, currency, startTime, endTime]);

    return (
        <Box>
            <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            <Box sx={{ marginBottom: 1 }}>
                <FormControl>
                    <InputLabel id="currency-select-label">Display all amounts in</InputLabel>
                    <Select
                        labelId="currency-select-label"
                        id="currency-select"
                        value={currency}
                        label="Display all amounts in"
                        onChange={(e) => {
                            setCurrency(e.target.value);
                        }}
                        sx={{ width: 200, marginRight: 1 }}
                    >
                        <MenuItem key={ORIGINAL_CURRENCY} value={ORIGINAL_CURRENCY}>
                            {ORIGINAL_CURRENCY}
                        </MenuItem>
                        {supportedCurrencies.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Beginning of the period"
                        onChange={(value) => {
                            setStartTime(value);
                        }}
                        value={dayjs(startTime)}
                        sx={{
                            marginTop: { xs: 0, sm: 1, md: 0, lg: 0, xl: 0 },
                            marginRight: 1,
                        }}
                    />
                    <DatePicker
                        label="End of the period"
                        sx={{ marginTop: { xs: 1, sm: 1, md: 0, lg: 0, xl: 0 } }}
                        onChange={(value) => {
                            setEndTime(value);
                        }}
                        value={dayjs(endTime)}
                    />
                </LocalizationProvider>
            </Box>

            <TransactionsGrid
                groshi={groshi}
                supportedCurrencies={supportedCurrencies}
                rows={rows}
                setRows={setRows}
                setErrorMessage={setErrorMessage}
            />
        </Box>
    );
}
