const WebSocket = require('ws');
const axios = require('axios').default;
const { READY } = require('./GatewayEvent.js');
const parseArgs = require("./util/ParseArgs.js");
const InteractionResponse = require('./interaction/InteractionResponse.js');
const InteractionCallBack = require('./interaction/InteractionCallback.js');
const { ChannelMessageWithSource, Pong } = require('./interaction/InteractionResponseType.js');
const { HELLO, IDENTIFY, HEARTBEATACK, HEARTBEAT, DISPATCH, RESUME } = require('./Opcode.js');

class Client {
    constructor(apiVersion, encoding, gatewayUrl) {
        this.apiVersion = apiVersion;
        this.encoding = encoding;
        this.gatewayUrl = gatewayUrl;
        //0 = sent a heartbeat 1 = recieved a heartbeatack 0 && 1 = connection is still fine
        this.pulse = true;
        this.ws = null;

        this.online = false;
        this.authorized = false;
        this.sessionid = null;

        //these set of methods must be ran no matter what.
        this.onMethod = () => {
            console.log("Connected!");
            this.online = true;
        };
        this.closeMethod = () => {
            console.log("Disconnected!");
            clearInterval(this.keepAlive);
        };
        this.listenMethod = (msg) => {
            this.handleHeartbeat(msg);
        };
    }

    get websocket() {
        return this.ws;
    }

    async validConnection() {
        return new Promise((resolve, reject) => {
            const testOnline = () => {
                if (this.online) return resolve(this.online);
                setTimeout(testOnline, 1000)
            };
            testOnline();
        });
    }

    async validAuthorize() {
        return new Promise((resolve, reject) => {
            const testAuthorized = () => {
                if (this.authorized) return resolve(this.authorized);
                setTimeout(testAuthorized, 1000)
            };
            testAuthorized();
        });
    }

    initWebSocket() {
        console.log("Init websocket");
        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.on('open', this.onMethod);
        this.ws.on('close', this.closeMethod);
        this.ws.on('listen', this.listenMethod);
    }

    restart() {
        clearInterval(this.keepAlive);
        this.ws.close();
        this.initWebSocket();

        if (this.token == null) {
            return;
        }
        this.resuming = true;
        const resume = {
            "op": RESUME,
            "d": {
              "token": this.token,
              "session_id": this.session_id,
              "seq": thiis.sequenceNumber
            }
        };
        this.ws.send(JSON.stringify(resume));
    }

    handleHeartbeat(msg) {
        msg = JSON.parse(msg);
        const opcode = msg["op"];
        this.sequenceNumber = msg["s"];
        switch (opcode) {
            case HELLO:
                this.interval = msg["d"]["heartbeat_interval"];
                
                if (this.keepAlive) {
                    clearInterval(this.keepAlive);
                }
                this.keepAlive = setInterval(() => {
                    if (!this.pulse) { // did not recieve a connection
                        this.restart();
                    }
                    const heartbeat = JSON.stringify({ 
                        op: HEARTBEAT,
                        d: this.sequenceNumber
                    });
                    this.ws.send(heartbeat);
                    this.pulse = false;
                }, this.interval);
                break;
            case HEARTBEATACK:
                this.pulse = true;
                break;
            case INVALIDSESSION:
                if (this.resuming) {
                    setTimeout(() => {
                        this.authorizeToken(this.token);
                        this.resuming = false;
                    }, 5000);
                } else {
                    console.log("Maximum concurrency is limited!");
                }
                break;
            case RESUME:
                this.resuming = false;
                break;
            case DISPATCH:
                this.handleDispatch(msg);
                break;
        }
    }

    handleDispatch(msg) {
        const event = msg["t"];
        //console.log(msg);
        switch(event) {
            case READY:
                this.sessionid = msg["d"]["session_id"];
                this.applicationid = msg["d"]["application"]["id"];
                this.authorized = true;
                break;
            case INTERACTION_CREATE:
                const d = msg["d"];
                const member = d["member"];
                const intID = d["id"];
                const token = d["token"]; //interaction token
                const data = d["data"];

                //todo: event emitter
                console.log(data);
                const response = new InteractionResponse(this, member, intID, token, data);
                const args = parseArgs(data["options"]);
                const url = `https://pokeapi.co/api/v2/pokemon/${args["name"]}`;
                axios.get(url).then(pokemon => {
                    const embeddedImage = {"image": {"url": pokemon["data"]["sprites"]["front_shiny"]}};
                    response.setResponseType(ChannelMessage)
                        .setCallback(
                            new InteractionCallBack()
                            .addEmbed(embeddedImage))
                        .respond();
                }).catch(err => {
                    response.setResponseType(ChannelMessage)
                        .setCallback(
                            new InteractionCallBack()
                            .setContent(`${args["name"]} was not found!`))
                        .respond();
                });
                break;
            case APPLICATION_COMMAND_UPDATE:
                break;
        }
    }

    listen(func) {
        this.ws.on('message', (msg) => {
            this.listenMethod(msg);
            func(msg);
        });
    }

    authorizeToken(token) {
        this.token = token;
        const request = {
            "op": IDENTIFY,
            "d": {
              "token": token,
              "intents": 513,
              "properties": {
                "$os": "linux",
                "$browser": "my_library",
                "$device": "my_library"
                }
            }
        }
        //looking at bot token...
        this.ws.send(JSON.stringify(request));
    }

    close() {
        clearInterval(this.keepAlive);
        this.ws.close();
    }
}

module.exports = Client;