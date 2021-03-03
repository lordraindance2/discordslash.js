const Type = require("./CommandOptionType.js");

class CommandOptions {
    constructor() {
        this._type = null;
        this._name = null;
        this._description = null;
        this._required = false;
        this._choices = [];
        this._options = [];
    }

    get type() {
        return this._type;
    }

    setType(value) {
        for (const key of Object.keys(Type)) {
            if (value == Type[key]) {
                this._type = value;
                return this;
            }
        }
        console.log(`${value} is not an appropriate OptionCommandType!`);
        return this;
    }

    get name() {
        return this._name;
    }

    setName(value) {
        this._name = value;
        return this;
    }

    get description() {
        return this._description;
    }

    setDescription(value) {
        this._description = value;
        return this;
    }

    get required() {
        return this._required;
    }

    setRequired(value) {
        this._required = value;
        return this;
    }

    get choices() {
        return this._choices;
    }

    addChoice(choice) {
        this._choices.push(choice);
        return this;
    }

    get options() {
        return this.options;
    }

    addOption(option) {
        this._options.push(option);
        return this;
    }

    format() {
        let formattedChoices = [];
        for (const choice of this._choices) {
            formattedChoices.push(choice.format());
        }
        let formattedOptions = [];
        for (const option of this._options) {
            formattedOptions.push(option.format());
        }

        const data = {
            "name": this._name,
            "description": this._description,
            "type": this._type,
            "required": this._required,
        };

        if (formattedChoices.length != 0) {
            data["choices"] = formattedChoices;
        }
        if (formattedOptions.length != 0) {
            data["options"] = formattedOptions;
        }
        return data;
    }
}

module.exports = CommandOptions;