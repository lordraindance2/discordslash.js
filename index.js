require('dotenv').config();
const getGateway = require("./slash/util/GetGateway.js");
const Client = require("./slash/Client.js");
const AddCommandRequest = require("./slash/command/AddCommandRequest.js");
const CommandOptions = require("./slash/command/options/CommandOptions.js");
const { STRING, SUB_COMMAND } = require("./slash/command/options/CommandOptionType.js");
let client;

const API_VERSION = 8;
const DEFAULT_ENCODING = "json";

let cachedGateUrl;

const listen = (msg) => {
    //console.log(msg);
};

const makePokemonCommand = () => {
    const addreq = new AddCommandRequest("pokemon");
    const option = new CommandOptions();
    option.setName("name")
        .setType(STRING)
        .setDescription("Find pokemon by name")
        .setRequired(false);
    addreq.setDescription("Find a pokemon")
        .addOption(option);
    return addreq;
};

const main = async () => {
    //cache the url
    const baseLink = await getGateway(API_VERSION);
    if (baseLink == null) {
        console.log("unable to get the websocket gateway link!");
        process.exit(1);
    }
    cachedGateUrl = `${baseLink}/?v=${API_VERSION}&encoding=${DEFAULT_ENCODING}`;
    client = new Client(API_VERSION, DEFAULT_ENCODING, cachedGateUrl); //replace with discord.js client in the future
    client.initWebSocket();
    client.listen(listen);
    if(await client.validConnection()) {
        console.log("Websocket is now online!");
    }
    client.authorizeToken(process.env.BOT_TOKEN);
    if(await client.validAuthorize()) {
        console.log("Bot is now online!");
    }
    const addreq = makePokemonCommand();
    addreq.post(client);
    process.on('SIGINT', () => {
        console.log("Caught interrupt signal");
        client.close();
        process.exit();
    });
};

main();
