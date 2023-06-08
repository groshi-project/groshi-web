import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StorageIcon from "@mui/icons-material/Storage";
import { useNavigate } from "react-router-dom";

export default function TopbarGuest() {
    const navigate = useNavigate();

    const navigateToSignIn = (e) => {
        e.preventDefault();
        navigate("/sign-in");
    };

    const navigateToSignUp = (e) => {
        e.preventDefault();
        navigate("/sign-up");
    };

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography noWrap variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        groshi
                    </Typography>

                    <Button onClick={(e) => navigateToSignIn(e)} color="inherit" sx={{ mr: 1 }}>
                        Sign in
                    </Button>

                    <Button onClick={(e) => navigateToSignUp(e)} color="inherit">
                        Sign up
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
