import * as mongoose from "mongoose";
import { QueueService } from "./interfaces";
import { IMongoQueueUser, QueueSchema, QueueEntry, PersistedQueueEntry } from '../models/queueModel'
import { injectable } from "inversify";


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoQueueService implements QueueService{
    private queueModel: mongoose.Model<IMongoQueueUser>;

    constructor(){
        this.queueModel = mongoose.model("csqueue", QueueSchema);
    }

    public async createEntry(queueEntry: QueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueModel.create(queueEntry);  
    }

    public async removeEntry(queueEntry: QueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueModel.remove(queueEntry);  
    }
    public async updateEntry(queueEntry: QueueEntry, id: string): Promise<PersistedQueueEntry>{
        return await this.queueModel.update({_id: id}, queueEntry);
    }

    public async getHead(): Promise<PersistedQueueEntry>{
        return await this.queueModel.findOne().sort( {$natural: 1} );
    }

    public async getEntries(): Promise<PersistedQueueEntry[]>{
        return await this.queueModel.find().sort( {$natural: 1} );
    }

}