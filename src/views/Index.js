import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as routes from "../routes";
import { TOKEN } from "../localStorageKeys";

const IndexView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            navigate(routes.STATISTICS_ROUTE);
        } else {
            navigate(routes.LOGIN_ROUTE);
        }
    }, []);
};

export default IndexView;
