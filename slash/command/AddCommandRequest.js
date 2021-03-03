const axios = require('axios').default;

const CommandRequest = require("./CommandRequest.js");

class AddCommandRequest extends CommandRequest {
    constructor(name) {
        super(name)
    }


    post(client, guildID) {
        const url = (typeof(guildID) === "undefined") ? 
            `https://discord.com/api/v8/applications/${client.applicationid}/commands` : 
            `https://discord.com/api/v${client.apiVersion}/applications/${client.applicationid}/guilds/${guildID}/commands`;
        console.log(url);
        const headers = {
            'Content-Type': 'application/json',
            "Authorization": `Bot ${client.token}`
        };
        const data = this.format();
        const config = {
            method: 'post',
            url: url,
            headers: headers,
            data: data
        };
        axios(config).then(response => {
            console.log(response["data"]);
            console.log(`Successfully added the command ${this.name}`);
        }).catch(error => {
            console.log(error["response"]);
        });

    }

}

module.exports = AddCommandRequest;