const axios = require("axios").default;

class InteractionResponse {
    constructor(client, member, intID, interaction_token) {
        this._client = client;
        this._member = member;
        this._intID = intID;
        this._interaction_token = interaction_token;

        this._responseType = null;
        this._callbackData = null;
    }

    get client() {
        return this._client;
    }

    get member() {
        return this._member;
    }

    get responseType() {
        return this._responseType;
    }

    setResponseType(value) {
        this._responseType = value;
        return this;
    }

    get callback() {
        return this._callbackData;
    }

    setCallback(value) {
        this._callbackData = value;
        return this;
    }

    respond() {
        const url = `https://discord.com/api/v${this._client.apiVersion}/interactions/${this._intID}/${this._interaction_token}/callback`;
        const data = {
            "type": this._responseType
        };
        if (this._responseType == 3 || this._responseType == 4) {
            data["data"] = this._callbackData.format();
        };
        return axios.post(url, data);
    }
}

module.exports = InteractionResponse;