import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import GroshiClient from "../groshi";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArchiveIcon from "@mui/icons-material/Archive";
import SettingsIcon from "@mui/icons-material/Settings";
import PollIcon from "@mui/icons-material/Poll";
import { Navigate, useNavigate } from "react-router-dom";

export const sidebarWidth = 240;

export function Sidebar(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logout = (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");
        let groshi = new GroshiClient(token);

        groshi.authLogout().then((response) => {
            if (response.status === 200) {
                localStorage.removeItem("token");
                navigate("/sign-in");
            } else {
                console.log("error logging out!");
                response.json().then((data) => {
                    console.log(data);
                });
            }
        });
    };

    const drawer = (
        <div>
            <Toolbar></Toolbar>
            <Divider />
            <List>
                <ListItem key="this-month" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <CalendarMonthIcon></CalendarMonthIcon>
                        </ListItemIcon>
                        <ListItemText primary="This month" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="Archive" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ArchiveIcon></ArchiveIcon>
                        </ListItemIcon>
                        <ListItemText primary="Archive" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="statistics" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PollIcon></PollIcon>
                        </ListItemIcon>
                        <ListItemText primary="Statistics" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="settings" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsIcon></SettingsIcon>
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem key="logout" disablePadding>
                    <ListItemButton onClick={(e) => logout(e)}>
                        <ListItemIcon>
                            <LogoutIcon></LogoutIcon>
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                component="nav"
                sx={{ width: { sm: sidebarWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: sidebarWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: sidebarWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
