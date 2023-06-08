import { Box, Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <Box>Settings!</Box>
        </Container>
    );
}
