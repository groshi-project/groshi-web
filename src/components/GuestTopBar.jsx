import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import * as routes from "../routes";

export default function GuestTopBar({ login, register }) {
    const navigate = useNavigate();

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography noWrap variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        groshi
                    </Typography>

                    <Button
                        variant={"outlined"}
                        color="inherit"
                        sx={{ mr: 1 }}
                        disabled={!register}
                        onClick={() => {
                            navigate(routes.LOGIN_ROUTE);
                        }}
                    >
                        Log in
                    </Button>

                    <Button
                        variant={"outlined"}
                        color="inherit"
                        disabled={!login}
                        onClick={() => {
                            navigate(routes.REGISTER_ROUTE);
                        }}
                    >
                        Register
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
