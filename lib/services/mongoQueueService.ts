import * as mongoose from "mongoose";
import { QueueService } from "./interfaces";
import { IMongoQueueUser, QueueSchema, QueueEntry, PersistedQueueEntry } from '../models/queueModel'
import { injectable } from "inversify";
import { PersistedGroup } from "models/groupModel";
import { provideSingleton } from "../common/inversify.config";
import { provide } from "inversify-binding-decorators";


//mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@provide(MongoQueueService)
export class MongoQueueService implements QueueService{
    private queueModel: mongoose.Model<IMongoQueueUser>;

    constructor(){
        this.queueModel = mongoose.model("csqueue", QueueSchema);
    }

    public async createEntry(queueEntry: QueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueModel.create(queueEntry);  
    }

    public async removeEntry(queueEntry: PersistedQueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueModel.remove(queueEntry);  
    }
    public async updateEntry(queueEntry: QueueEntry, id: string): Promise<PersistedQueueEntry>{
        return await this.queueModel.update({_id: id}, queueEntry);
    }

    public async entryExists(group: PersistedGroup): Promise<boolean>{
        this.queueModel.findOne({ "users": group.users});
        return false;
    }

    public async removeUserFromEntry(userId: string): Promise<PersistedQueueEntry>{
        let res = await this.queueModel.findOneAndUpdate({ "users": { $in: [userId] } }, { $pull: { users: userId } });
        if(res !== null && res.users.length === 0){
            this.removeEntry(res);
        }
        return res;
    }

    public clearQueueEntries(): void {
        this.queueModel.remove({});
    }

    public async getHead(): Promise<PersistedQueueEntry>{
        return await this.queueModel.findOne().sort( {$natural: 1} );
    }

    public async getEntries(): Promise<PersistedQueueEntry[]>{
        return await this.queueModel.find().sort( {$natural: 1} );
    }

}