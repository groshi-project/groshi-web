export default class GroshiAPIClient {
    BASE_URL = "http://192.168.1.32:80";

    token = null;

    constructor(token = null) {
        this.token = token;
    }

    #sendRequest(HTTPMethod, path, body = null, query_params = null, authorize = false) {
        let url = new URL(this.BASE_URL + path);
        if (query_params) {
            url.search = new URLSearchParams(query_params).toString();
        }

        let headers = {
            "Content-Type": "application/json",
        };

        if (authorize) {
            if (!this.token) {
                throw new Error("authorize is set to true, but no token was set");
            }
            headers["Authorization"] = "Bearer " + this.token;
        }

        return fetch(url, {
            headers: headers,
            mode: "cors",
            method: HTTPMethod,
            body: body ? JSON.stringify(body) : undefined,
        }).then((response) => {
            return response.json().then((data) => {
                if (response.status !== 200) {
                    throw new Error(data.error_message);
                }
                return data;
            });
        });
    }
    // methods related to authorization:
    authLogin(username, password) {
        return this.#sendRequest("POST", "/auth/login", {
            username: username,
            password: password,
        });
    }

    // methods related to user:
    userCreate(username, password) {
        return this.#sendRequest("POST", "/user", { username: username, password: password });
    }

    // methods related to transactions:
    transactionCreate() {}
    transactionReadOne() {}

    transactionReadMany(start_time, end_time = new Date(), currency = undefined) {
        let query_params = {
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
        };

        if (currency !== undefined) {
            query_params["currency"] = currency;
        }

        return this.#sendRequest("GET", "/transactions", null, query_params, true);
    }
    transactionsSummary(currency, start_time, end_time = new Date()) {
        return this.#sendRequest(
            "GET",
            "/transactions/summary",
            null,
            {
                currency: currency,
                start_time: start_time.toISOString(),
                end_time: end_time.toISOString(),
            },
            true
        );
    }
}
