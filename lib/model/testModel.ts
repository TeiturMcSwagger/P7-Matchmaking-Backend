import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TestSchema = new Schema({
    element: {
        type: String,
        required: "Enter element1"
    },
    note: {
        type: String,
        required: "Enter testVar2"
    }
});