const axios = require('axios').default;

const CommandRequest = require("./CommandRequest.js");

class AddCommandRequest extends CommandRequest {
    constructor(name) {
        super(name)
    }


    post(client) {
        const url = `https://discord.com/api/v${client.apiVersion}/applications/${client.applicationid}/guilds/292086052934516739/commands`
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
            console.log(`Successfully added the command ${this.name}`);
        }).catch(error => {
            console.log(error["response"]);
        });
    }
}

module.exports = AddCommandRequest;