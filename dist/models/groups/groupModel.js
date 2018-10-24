"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const randomstring = require("randomstring");
const Schema = mongoose.Schema;
exports.GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    game: {
        type: String,
        required: true,
        minlength: 1,
    },
    maxSize: {
        type: Number,
        min: 2
    },
    // users: Array<User>
    invite_id: {
        type: String,
        default: randomstring.generate
    },
    users: Array
});
//# sourceMappingURL=groupModel.js.map