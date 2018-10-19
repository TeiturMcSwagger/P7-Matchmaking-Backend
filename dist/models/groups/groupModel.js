"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.GroupSchema = new Schema({
    name: String,
    game: String,
    maxSize: Number,
});
//# sourceMappingURL=groupModel.js.map