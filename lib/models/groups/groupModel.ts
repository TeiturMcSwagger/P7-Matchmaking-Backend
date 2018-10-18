import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const GroupSchema = new Schema({
    name: String,
    game: String,
    maxSize: Number,
    // users: Array<User>
});
