import { useEffect, useState } from "react";
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
import {
    SETTINGS_THEME,
    TOKEN,
    SETTINGS_WEEK_FIRST_DAY,
    SETTINGS_PRIMARY_CURRENCY_CODE,
    SETTINGS_PRIMARY_CURRENCY_SYMBOL,
} from "../localStorageKeys";
import { useNavigate } from "react-router-dom";
import GroshiAPIClient from "../groshi";
import { LoginOutlined } from "@mui/icons-material";
import { LOGIN_ROUTE } from "../routes";

const SettingsView = ({ name }) => {
    console.log(name);
    const navigate = useNavigate();

    const settingsNavLinkStyle = {
        marginBottom: 1,
        width: { sm: "100%", md: "100%", lg: "50%" },
        "&:hover": (_) => ({
            // backgroundColor: theme.palette.secondary.main,
            cursor: "pointer",
        }),
    };

    // available values for "settings.theme":
    const THEME_OPTIONS = {
        0: "Use system settings",
        1: "Light",
        2: "Dark",
    };

    // available values for "settings.weekFirstDay"
    const WEEK_FIRST_DAY_OPTIONS = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };

    // available currencies (are to be fetched using API):
    const [availableCurrencies, setAvailableCurrencies] = useState([]);

    // default values for the settings above:
    const DEFAULT_THEME = "0"; // "Use system settings"
    const DEFAULT_WEEK_FIRST_DAY = "0"; // "Sunday"
    const DEFAULT_PRIMARY_CURRENCY_CODE = "USD"; // "USD" (really?)

    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [weekFirstDay, setWeekFirstDay] = useState(DEFAULT_WEEK_FIRST_DAY);
    const [primaryCurrencyCode, setPrimaryCurrencyCode] = useState("");

    // fetch available currencies:
    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        if (!token) {
            navigate(LOGIN_ROUTE);
            return;
        }
        const groshi = new GroshiAPIClient(token);
        groshi
            .currenciesRead()
            .then((currencies) => {
                setAvailableCurrencies(currencies);
            })
            .catch((e) => {
                console.error("Could not fetch currencies:", e);
            });
    }, []);

    // read stored theme:
    useEffect(() => {
        const storedTheme = localStorage.getItem(SETTINGS_THEME);
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    // read stored first day of the week:
    useEffect(() => {
        const storedWeekFirstDay = localStorage.getItem(SETTINGS_WEEK_FIRST_DAY);
        if (storedWeekFirstDay) {
            setWeekFirstDay(storedWeekFirstDay);
        }
    }, []);

    // read stored primary currency:
    useEffect(() => {
        // ensure that array of available currencies has been fetched:
        if (availableCurrencies.length === 0) {
            return;
        }

        const storedPrimaryCurrencyCode = localStorage.getItem(SETTINGS_PRIMARY_CURRENCY_CODE);
        if (storedPrimaryCurrencyCode) {
            setPrimaryCurrencyCode(storedPrimaryCurrencyCode);
        } else {
            setPrimaryCurrencyCode(DEFAULT_PRIMARY_CURRENCY_CODE);
        }
    }, [availableCurrencies]);

    const handlePrimaryCurrencySelectChange = (e) => {
        const code = e.target.value;
        setPrimaryCurrencyCode(code);

        let symbol;
        for (const currency of availableCurrencies) {
            if (currency.code === code) {
                symbol = currency.symbol;
                break;
            }
        }

        localStorage.setItem(SETTINGS_PRIMARY_CURRENCY_CODE, code);
        localStorage.setItem(SETTINGS_PRIMARY_CURRENCY_SYMBOL, symbol);
    };

    const handleWeekFirstDaySelectChange = (e) => {
        const value = e.target.value;
        setWeekFirstDay(value);
        localStorage.setItem(SETTINGS_WEEK_FIRST_DAY, value);
    };

    const handleThemeSelectChange = (e) => {
        const value = e.target.value;
        // swapTheme(value);
        setTheme(value);
        localStorage.setItem(SETTINGS_THEME, value);
    };

    return (
        <Box>
            <Typography variant={"h6"} sx={{ marginBottom: 1 }}>
                Interface settings
            </Typography>
            <FormControl sx={{ marginRight: 1 }}>
                <InputLabel id="select-theme-label">Theme</InputLabel>
                <Select
                    labelId="select-theme-label"
                    id="select-theme"
                    value={theme}
                    label="Theme"
                    onChange={handleThemeSelectChange}
                    sx={{ width: 200, marginBottom: 1 }}
                >
                    {Object.keys(THEME_OPTIONS).map((key) => (
                        <MenuItem key={key} value={key}>
                            {THEME_OPTIONS[key]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ marginRight: 1 }}>
                <InputLabel id="select-week-first-day-label">First day of the week</InputLabel>
                <Select
                    labelId="select-week-first-day-label"
                    id="select-week-first-day"
                    value={weekFirstDay}
                    label="First day of the week"
                    onChange={handleWeekFirstDaySelectChange}
                    sx={{ width: 150 }}
                >
                    {Object.keys(WEEK_FIRST_DAY_OPTIONS).map((key) => (
                        <MenuItem key={key} value={key}>
                            {WEEK_FIRST_DAY_OPTIONS[key]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="select-primary-currency-label">Primary currency</InputLabel>
                <Select
                    labelId="select-primary-currency-label"
                    id="select-primary-currency"
                    value={primaryCurrencyCode}
                    label="Primary currency"
                    onChange={handlePrimaryCurrencySelectChange}
                    sx={{ width: 150 }}
                >
                    {availableCurrencies.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                            {currency.code}
                        </MenuItem>
                    ))}
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
};

export default SettingsView;
