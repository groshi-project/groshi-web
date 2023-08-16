export class GroshiAPIError extends Error {}

export default class GroshiAPIClient {
    BASE_URL = "http://localhost:80";
    token = null;

    constructor(token) {
        this.token = token;
    }

    setToken(token) {
        if (this.token) {
            throw new Error("token has already been set");
        }
        this.token = token;
    }

    #sendRequest(HTTPMethod, path, body = {}, query_params = {}, authorize = false) {
        if (authorize) {
            if (!this.token) {
                throw new Error("authorization required, but auth token is not set");
            }
        }
        let url = new URL(this.BASE_URL + path);
        if (query_params) {
            url.search = new URLSearchParams(query_params).toString();
        }

        return fetch(url, {
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            method: HTTPMethod,
            body: JSON.stringify(body),
        }).then((response) => {
            return response;
        });
    }
    // methods related to authorization:
    authLogin(username, password) {
        return this.#sendRequest("POST", "/auth/login", {
            username: username,
            password: password,
        });
    }

    authLogout() {
        return this.#sendRequest("POST", "/auth/logout", {}, {}, true);
    }

    // methods related to users:
    userCreate(username, password) {
        return this.#sendRequest("POST", "/user/", { username: username, password: password });
    }
}
