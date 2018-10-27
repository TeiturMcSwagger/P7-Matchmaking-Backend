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
        minlength: 1,
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
});



export interface IMongoGroup extends IGroup, mongoose.Document{}
export interface IGroup {
    name: string;
    game: string;
    maxSize: number;
    users: string[];
    invite_id: string;
}
export interface IGroupUser {
    user_id: string;
    group_id: string;
}
