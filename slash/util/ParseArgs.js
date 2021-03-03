const parseArgs = (options) => {
    const data = {};
    for (const option of options) {
        data[option["name"]] = option["value"];
    }
    return data;
};

module.exports = parseArgs;