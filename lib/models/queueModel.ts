import * as mongoose from "mongoose";
import { Persisted } from "./interfaces";

const Schema = mongoose.Schema;

export const QueueSchema = new Schema({
    users: {
        type: [String],
        default: []
    },
    mode: {
        type: Number,
        required: true
    },
    rank: {
        type: Number
    },
    level: {
        type: Number,
        required: true
    }
});

export interface PersistedQueueEntry extends QueueEntry,Persisted {}
export interface QueueEntry{
    users: string[],
    gameSettings: {
        mode: number,
        rank: number,
        level: number
    }
}

export interface IMongoQueueUser extends QueueEntry, mongoose.Document{}