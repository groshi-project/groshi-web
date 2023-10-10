import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as routes from "../routes";
import { TOKEN } from "../localStorageKeys";
export default function Index() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            navigate(routes.STATISTICS_ROUTE);
        } else {
            navigate(routes.LOGIN_ROUTE);
        }
    }, []);
}
