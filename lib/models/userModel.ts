import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema: mongoose.Schema = new Schema({
    name: {
        type: String,
        required: [true, "a name is required"],
        min: [1, "a name requires minimum 1 letter"]
    },
    discordId: {
        type: String,
        requried: [true, "a discord name is required"],
        min: [6, "a discord id is guaranteed to be more than 6 characters"]
    },
    created: String
});

export interface IMongoUser extends IUser, mongoose.Document { _id: string }

export interface IUser {
    _id: string,
    name: string,
    created: Date,
    discordId: string
}

export interface IUserCreate {
    name: string,
    discordId: string
}
