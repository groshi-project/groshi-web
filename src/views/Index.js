import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as routes from "../routes";
export default function Index() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate(routes.DASHBOARD_ROUTE);
        } else {
            navigate(routes.LOGIN_ROUTE);
        }
    }, []);
}
