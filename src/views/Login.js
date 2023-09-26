import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { Alert, Box, Checkbox, Container, FormControlLabel, Grid, Link } from "@mui/material";
import GroshiAPIClient from "../groshi";
import GuestTopBar from "../components/GuestTopBar";

import * as routes from "../routes";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    // redirect user to the dashboard if token is already stored:
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate(routes.STATISTICS_ROUTE);
        }
    }, []);

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let groshi = new GroshiAPIClient();

        groshi
            .authLogin(username, password)
            .then((response) => {
                localStorage.setItem("token", response.token);
                navigate(routes.STATISTICS_ROUTE);
            })
            .catch((e) => {
                setErrorMessage(e.toString());
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <GuestTopBar login></GuestTopBar>
            <Box
                sx={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Log in to your groshi account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={errorMessage != null}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errorMessage != null}
                    />

                    {errorMessage && <Alert severity="error">{errorMessage}.</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!validateForm()}
                    >
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Typography variant="body2">
                                {"Don't have an account? "}
                                <Link href={routes.REGISTER_ROUTE}>Create one</Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
