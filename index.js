require('dotenv').config();
const getGateway = require("./slash/util/GetGateway.js");
const Client = require("./slash/Client.js");
const AddCommandRequest = require("./slash/command/AddCommandRequest");

let client;

const API_VERSION = 8;
const DEFAULT_ENCODING = "json";

let cachedGateUrl;

const listen = (msg) => {
    //console.log(msg);
};

const main = async () => {
    //cache the url
    const baseLink = await getGateway(API_VERSION);
    if (baseLink == null) {
        console.log("unable to get the websocket gateway link!");
        process.exit(1);
    }
    cachedGateUrl = `${baseLink}/?v=${API_VERSION}&encoding=${DEFAULT_ENCODING}`;
    client = new Client(API_VERSION, DEFAULT_ENCODING, cachedGateUrl);
    client.initWebSocket();
    client.listen(listen);
    if(await client.validConnection()) {
        console.log("Websocket is now online!");
    }
    client.authorizeToken(process.env.BOT_TOKEN);
    if(await client.validAuthorize()) {
        console.log("Bot is now online!");
    }
    const addreq = new AddCommandRequest("test");
    addreq.post(client);
    process.on('SIGINT', () => {
        console.log("Caught interrupt signal");
        client.close();
        process.exit();
    });
};

main();
