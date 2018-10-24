import * as mongoose from "mongoose";
import * as randomstring from "randomstring";

const Schema = mongoose.Schema;

export const GroupSchema = new Schema({
    name: String,
    game: String,
    maxSize: Number,
    // users: Array<User>
    invite_id: {
        type: String,
        default: randomstring.generate
    }
});
