import * as mongoose from "mongoose";

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
    }
    // users: Array<User>
});
