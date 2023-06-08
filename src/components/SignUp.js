import { Box, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import GroshiClient from "../groshi";
import { useNavigate } from "react-router-dom";
import TopbarGuest from "./TopbarGuest";

export default function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        let groshi = new GroshiClient(null);
        groshi
            .sendRequest("/user/create", {
                username: username,
                password: password1,
            })
            .then((response) => {
                if (!response.success) {
                    setErrorMessage(response.error_details);
                    return;
                }
                navigate("/sign-in");
            });
    };

    const validateForm = () => {
        return username.length > 0 && password1.length > 0 && password1 === password2;
    };

    return (
        <Container component="main" maxWidth="xs">
            <TopbarGuest></TopbarGuest>
            <Box
                sx={{
                    mt: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Create groshi account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password-1"
                        label="Password"
                        type="password"
                        id="password-1"
                        autoComplete="new-password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password-2"
                        label="Confirm password"
                        type="password"
                        id="password-2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    ></TextField>
                    {errorMessage && <Alert severity="error">Error: {errorMessage}.</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!validateForm()}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-start">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
