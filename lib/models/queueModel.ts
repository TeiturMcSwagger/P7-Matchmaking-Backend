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
        mode: Mode,
        rank: Rank,
        level: Level
    }
}


export enum Level {
    SILVER1 = 0,
    SILVER2 = 1,
    SILVER3 = 2,
    SILVER4 = 3,
    SILVERELITE = 4,
    SILVERELITEMASTER = 5,
    GOLDNOVA1 = 6,
    GOLDNOVA2 = 7,
    GOLDNOVA3 = 8,
    GOLDNOVAMASTER = 9,
    MASTERGUARDIAN1 = 10,
    MASTERGUARDIAN2 = 11,
    MASTERGUARDIANELITE = 12,
    DESTINGUISHEDMASTERGUARDIAN = 13,
    LEGENDARYEAGLE = 14,
    LEGENDARYEAGLEMASTER = 15,
    SUPREMEMASTERFIRSTCLASS = 16,
    GLOBALELITE = 17
}

export enum Mode {
    COMPETITIVE = 1,
    CASUAL = 2
}

export enum Rank {
    ABOVE = 2,
    SAME = 1,
    BELOW = 0,
}

export interface IMongoQueueUser extends QueueEntry, mongoose.Document{}