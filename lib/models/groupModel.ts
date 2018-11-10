import * as mongoose from "mongoose";
import * as randomstring from "randomstring";

const Schema = mongoose.Schema;

export const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    game: {
        type: String,
        required: true,

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
    users: {
        type: [String],
        default: []
    },
    visible: {
        type: Boolean,
        default: false
    },
    discordChannels: {
        type: [String],
        default: []
    }
});


export interface IPersistedGroup extends Group { _id: string; }
export class Group {
    discordChannels: string[];
    name: string;
    game: string;
    maxSize: number;
    users: string[];
    invite_id: string;
    visible: boolean;
};

export interface IMongoGroup extends IGroup, mongoose.Document { _id: string }
export interface IGroup {
    _id: string;
    discordChannels: string[];
    name: string;
    game: string;
    maxSize: number;
    users: string[];
    invite_id: string;
    visible: boolean;
}

export interface IGroupCreateBody {
    name: string,
    game: string,
    maxSize: number,
    users: string[]
}

export interface IGroupUser {
    user_id: string;
    group_id: string;
}

export interface IGame {
    name: string,
    maxSize: number
}
