import * as mongoose from "mongoose";
import { Persisted } from "./interfaces";

const Schema = mongoose.Schema;

export const QueueSchema = new Schema({
    users: {
        type: [String],
    },
    gameSettings: {
        type: {mode: Number, rank: Number, Level: Number }
    },
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