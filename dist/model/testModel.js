"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.TestSchema = new Schema({
    element: {
        type: String,
        required: "Enter element1"
    },
    note: {
        type: String,
        required: "Enter testVar2"
    }
});
//# sourceMappingURL=testModel.js.map