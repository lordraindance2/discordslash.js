class CommandOptionChoice {
    constructor(name, value) {
        this.name(name);
        this.value(value);
    }

    get name() {
        return this._name;
    }

    setName(name) {
        this._name = name;
        return this;
    }

    get value() {
        return this._value;
    }
    
    setValue(value) {
        this._value = value; 
        return this;
    }

    format() {
        return {
            "name": this._name,
            "value": this._value
        };
    }
}

module.exports = CommandOptionChoice;