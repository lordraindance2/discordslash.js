const axios = require('axios').default;

const getGateway = async (apiVersion) => {
    const gatewaylookupurl = `https://discord.com/api/v${apiVersion}/gateway`;
    try {
        const response = await axios.get(gatewaylookupurl);
        const data = response["data"];
        return data["url"];
    } catch (error)
    {
        console.log(error);
        return null;
    }
};

module.exports = getGateway;