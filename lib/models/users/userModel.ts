import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema : mongoose.Schema = new Schema({
    name: {
        type: String,
        required: [true, "a name is required"],
        min: [1, "a name requires minimum 1 letter"] 
    },
    created: String
});
