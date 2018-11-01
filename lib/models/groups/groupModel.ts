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
    discordChannels: {
        type: [String],
        default: []
    }
});
