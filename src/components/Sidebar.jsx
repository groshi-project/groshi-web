import * as React from "react";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { useNavigate, useLocation } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Statistics from "../views/Statistics";
import Settings from "../views/Settings";
import Transactions from "../views/Transactions";

import * as routes from "../routes";
import BarChartIcon from "@mui/icons-material/BarChart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { TOKEN } from "../localStorageKeys";

const drawerWidth = 220;

function Placeholder() {
    return <Box>Loading...</Box>;
}

class NavItem {
    name;
    icon;
    path;
    element;

    constructor(name, icon, path, element) {
        this.name = name;
        this.icon = icon;
        this.path = path;
        this.element = element;
    }
}

const NavItemStatistics = new NavItem(
    "Statistics",
    <BarChartIcon />,
    routes.STATISTICS_ROUTE,
    <Statistics />
);

const NavItemTransactions = new NavItem(
    "Transactions",
    <PointOfSaleIcon />,
    routes.TRANSACTIONS_ROUTE,
    <Transactions />
);

const NavItemSettings = new NavItem(
    "Settings",
    <SettingsIcon />,
    routes.SETTINGS_ROUTE,
    <Settings />
);

const NavItems = [NavItemStatistics, NavItemTransactions, NavItemSettings];

export default function Sidebar(props) {
    const { window } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);

    const navItemPlaceholder = new NavItem(undefined, undefined, undefined, <Placeholder />);
    const [selectedNavItem, setSelectedNavItem] = useState(navItemPlaceholder);

    // set current nav item according to the path:
    useEffect(() => {
        switch (location.pathname) {
            case routes.STATISTICS_ROUTE:
                setSelectedNavItem(NavItemStatistics);
                break;
            case routes.TRANSACTIONS_ROUTE:
                setSelectedNavItem(NavItemTransactions);
                break;
            case routes.SETTINGS_ROUTE:
                setSelectedNavItem(NavItemSettings);
                break;
            default:
                console.error("Unknown location path " + location.pathname);
                break;
        }
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogOut = () => {
        localStorage.removeItem(TOKEN);
        navigate(routes.LOGIN_ROUTE);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {NavItems.map((navItem) => (
                    <ListItem
                        key={navItem.name}
                        disablePadding
                        onClick={() => {
                            setSelectedNavItem(navItem);
                            handleDrawerToggle();
                        }}
                    >
                        <ListItemButton selected={navItem.name === selectedNavItem.name}>
                            <ListItemIcon>{navItem.icon}</ListItemIcon>
                            <ListItemText primary={navItem.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem key={"Log out"} disablePadding>
                    <ListItemButton onClick={() => handleLogOut()}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Log out"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        groshi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {selectedNavItem.element}
            </Box>
        </Box>
    );
}
