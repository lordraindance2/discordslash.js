class InteractionCallBack {
    constructor() {
        this._tts = false;
        this._content = null;
        this._embeds = [];
        this._allowedMentions = {};
    }

    get tts() {
        return this._tts;
    }

    setTTS(value) {
        this._tts = value;
        return this;
    } 

    get content() {
        return this._content;
    }

    setContent(value) {
        this._content = value;
        return this;
    }

    get embeds() {
        return this._embeds;
    }

    addEmbed(embed) {
        this._embeds.push(embed);
        return this;
    }

    format() {
        const data =  {
            "tts": this._tts,
            "content": this._content,
        };
        if (this._embeds.length != 0) {
            data["embeds"] = this._embeds;
        }
        if (this._allowedMentions.length != 0) {
            data["allowed_mentions"] = this._allowedMentions;
        }
        return data;
    }
}

module.exports = InteractionCallBack;