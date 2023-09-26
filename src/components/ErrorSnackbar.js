import { Fragment, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const DURATION = 4000;
export default function ErrorSnackbar(props) {
    const { errorMessage, setErrorMessage } = props;

    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (errorMessage) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorMessage]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        setErrorMessage(null);
    };

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={DURATION}
                onClose={handleClose}
                severity="error"
            >
                <Alert
                    variant="filled"
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
