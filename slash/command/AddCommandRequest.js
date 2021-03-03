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
        const data = {
            "name": "blep",
            "description": "Send a random adorable animal photo",
            "options": [
                {
                    "name": "animal",
                    "description": "The type of animal",
                    "type": 3,
                    "required": true,
                    "choices": [
                        {
                            "name": "Dog",
                            "value": "animal_dog"
                        },
                        {
                            "name": "Cat",
                            "value": "animal_cat"
                        },
                        {
                            "name": "Penguin",
                            "value": "animal_penguin"
                        }
                    ]
                },
                {
                    "name": "only_smol",
                    "description": "Whether to show only baby animals",
                    "type": 5,
                    "required": false
                }
            ]
        };
        const config = {
            method: 'post',
            url: url,
            headers: headers,
            data: data
        };

        axios(config).then(response => {
            console.log(`Successfully added the command ${this.name}`);
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = AddCommandRequest;