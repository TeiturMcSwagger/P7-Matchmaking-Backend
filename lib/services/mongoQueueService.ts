import * as mongoose from "mongoose";
import { QueueService } from "./interfaces";
import { IMongoQueueUser, QueueSchema } from '../models/queueModel'

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

export class MongoQueueService implements QueueService{
    private queueModel: mongoose.Model<IMongoQueueUser>;

    constructor(){
        this.queueModel = mongoose.model("csqueue", QueueSchema);
    }

    public queueUser(userId, mode, rank){
        const dbObject = new this.queueModel;
        dbObject.userId = userId;
        dbObject.mode = mode;
        dbObject.rank = rank;

        return dbObject.save();
    }
}