import * as mongoose from "mongoose";
import { QueueService } from "./interfaces";
import { IMongoQueueUser, QueueSchema, QueueEntry, PersistedQueueEntry } from '../models/queueModel'


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

export class MongoQueueService implements QueueService{
    private queueModel: mongoose.Model<IMongoQueueUser>;

    constructor(){
        this.queueModel = mongoose.model("csqueue", QueueSchema);
    }

    public async createEntry(queueEntry: QueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueModel.create(queueEntry);
        
    }

    public async getEntries(): Promise<PersistedQueueEntry[]>{
        return await this.queueModel.find().sort( {$natural: 1} );
    }

}