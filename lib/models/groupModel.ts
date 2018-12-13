import * as mongoose from "mongoose";
import * as randomstring from "randomstring";
import { Persisted } from "./interfaces";
import { IUser } from "./userModel";

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
    },
    userList: {
        type: [],
        default: []
    }
});


export interface PersistedGroup extends Group, Persisted, IUserList { }
export interface Group {
    discordChannels: string[];
    name: string;
    game: string;
    maxSize: number;
    users: string[];
    invite_id: string;
    visible: boolean;
};

export interface IUserList {
    userList: IUser[];
}

export interface IMongoGroup extends Group, mongoose.Document, IUserList { }

export interface GroupCreateBody {
    name: string,
    game: string,
    maxSize: number,
    users: string[]
}

export interface GroupUser {
    user_id: string;
    group_id: string;
}

export interface IGame {
    name: string,
    maxSize: number
}

export interface IdPair {
    fromId: string;
    toId: string;
}
