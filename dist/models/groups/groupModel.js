"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const randomstring = require("randomstring");
const Schema = mongoose.Schema;
exports.GroupSchema = new Schema({
    name: String,
    game: String,
    maxSize: Number,
    // users: Array<User>
    invite_id: {
        type: String,
        default: randomstring.generate
    }
});
//# sourceMappingURL=groupModel.js.map