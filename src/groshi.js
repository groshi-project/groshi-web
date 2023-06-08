export default class GroshiClient {
    BASE_URL = "http://localhost:8080";

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

    sendRequest(apiMethod, params, auth) {
        if (auth) {
            if (!this.token) {
                throw new Error("authorization required, but auth token is not set");
            }
            params.token = this.token;
        }
        return fetch(this.BASE_URL + apiMethod, {
            method: "POST",
            body: JSON.stringify(params),
        }).then((response) => {
            return response.json();
        });
    }
}
