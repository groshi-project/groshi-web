import { GROSHI_SOCKET } from "./env";

export default class GroshiAPIClient {
    BASE_URL = GROSHI_SOCKET.replace(/\/+$/, "");

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
                    // console.log("Error details:", data.error_details);
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
    transactionsCreate(amount, currency, description, timestamp = new Date()) {
        return this.#sendRequest(
            "POST",
            "/transactions",
            {
                amount: amount,
                currency: currency,
                description: description,
                timestamp: timestamp.toISOString(),
            },
            null,
            true
        );
    }

    transactionsReadMany(startTime, endTime = new Date(), currency = null) {
        let query_params = {
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
        };

        if (currency) {
            query_params["currency"] = currency;
        }

        return this.#sendRequest("GET", "/transactions", null, query_params, true);
    }

    transactionsUpdate(
        uuid,
        newAmount = null,
        newCurrency = null,
        newDescription = null,
        newTimestamp = null
    ) {
        let body = {};
        if (newAmount) {
            body["new_amount"] = newAmount;
        }
        if (newCurrency) {
            body["new_currency"] = newCurrency;
        }
        if (newDescription) {
            body["new_description"] = newDescription;
        }
        if (newTimestamp) {
            body["new_timestamp"] = newTimestamp.toISOString();
        }
        return this.#sendRequest("PUT", "/transactions/" + uuid, body, null, true);
    }

    transactionsDelete(uuid) {
        return this.#sendRequest("DELETE", "/transactions/" + uuid, null, null, true);
    }
    transactionsSummary(currency, startTime, endTime = new Date()) {
        return this.#sendRequest(
            "GET",
            "/transactions/summary",
            null,
            {
                currency: currency,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
            },
            true
        );
    }

    // methods related to currencies:
    currenciesRead() {
        return this.#sendRequest("GET", "/currencies", null, null, false);
    }
}
