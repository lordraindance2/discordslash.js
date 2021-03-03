class CommandRequest {
    constructor(name) {
        this._name = name;
        this._description = null;
        this._options = [];   
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

    get options() {
        return this._options;
    }

    addOption(option) {
        this._options.push(option);
    }

    format() {
        let formattedOptions = [];
        for (const option of this._options) {
            formattedOptions.push(option.format());
        }
        const command = {
            "name": this._name,
            "description": this._description,
        };
        if (formattedOptions.length != 0) {
            command["options"] = formattedOptions;
        } 
        return command;
    }
    /*
    format() {
        return {
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
    }
    */
}


module.exports = CommandRequest;