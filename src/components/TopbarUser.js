import StorageIcon from "@mui/icons-material/Storage";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import * as React from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from "@mui/icons-material/Logout";
import { sidebarWidth } from "./Sidebar";

export default function TopbarUser({ handleSidebarToggle }) {
    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        navigate("/sign-in");
    };

    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${sidebarWidth}px)` },
                    ml: { sm: `${sidebarWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleSidebarToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <StorageIcon></StorageIcon>
                    <Typography noWrap variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        groshi
                    </Typography>
                    <Button color="inherit" onClick={(e) => logout(e)}>
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}