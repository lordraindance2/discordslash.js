const WebSocket = require('ws');
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
        console.log(msg);
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
                if (msg["t"] === "READY") {
                    this.sessionid = msg["d"]["session_id"];
                    this.applicationid = msg["d"]["application"]["id"];
                    this.authorized = true;
                    break;
                }
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