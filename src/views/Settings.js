import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import LaunchIcon from "@mui/icons-material/Launch";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import PasswordIcon from "@mui/icons-material/Password";
import PersonIcon from "@mui/icons-material/Person";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export function BasicTabs() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", marginTop: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Account" {...a11yProps(0)} />
                    <Tab label="User interface" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
        </Box>
    );
}

export default function Settings() {
    const settingsNavLinkStyle = {
        marginBottom: 1,
        width: { sm: "100%", md: "100%", lg: "50%" },
        "&:hover": (theme) => ({
            // backgroundColor: theme.palette.secondary.main,
            cursor: "pointer",
        }),
    };

    const [themeName, setThemeName] = useState("Use system settings");
    const handleChange = (event) => {
        setThemeName(event.target.value);
    };

    return (
        <Box>
            <Typography variant={"h6"} sx={{ marginBottom: 1 }}>
                Interface settings
            </Typography>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={themeName}
                    label="Theme"
                    onChange={handleChange}
                    sx={{ width: 200 }}
                >
                    <MenuItem value={"Use system settings"}>Use system settings</MenuItem>
                    <MenuItem value={"Light"}>Light</MenuItem>
                    <MenuItem value={"Dark"}>Dark</MenuItem>
                </Select>
            </FormControl>

            <Typography variant={"h6"} sx={{ marginBottom: 1, marginTop: 3 }}>
                Account settings
            </Typography>
            <Alert
                icon={<PersonIcon fontSize="inherit" />}
                severity="info"
                sx={settingsNavLinkStyle}
            >
                Change username
            </Alert>
            <Alert
                icon={<PasswordIcon fontSize="inherit" />}
                severity="info"
                sx={settingsNavLinkStyle}
            >
                Change password
            </Alert>
            <Alert
                icon={<LogoutIcon fontSize="inherit" />}
                severity="info"
                sx={settingsNavLinkStyle}
            >
                Log out
            </Alert>
            <Alert
                icon={<DeleteIcon fontSize="inherit" />}
                severity="error"
                sx={settingsNavLinkStyle}
            >
                Delete account
            </Alert>
        </Box>
    );
}
