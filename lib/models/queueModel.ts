import * as mongoose from "mongoose";
import { Persisted } from "./interfaces";

const Schema = mongoose.Schema;

export const QueueSchema = new Schema({
    userId: {
        type: String,
        required: [true, "a name is required"],
        min: [1, "a name requires minimum 1 letter"] 
    },
    mode: {
        type: String,
        required: true
    },
    rank: {
        type: String
    }
});

export interface PersistedQueueUser extends QueueUser,Persisted {}

export interface QueueUser{
    userId: String,
    mode: String,
    rank: String
}

export interface IMongoQueueUser extends QueueUser, mongoose.Document{}