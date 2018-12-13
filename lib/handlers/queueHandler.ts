import Handler from './handler';
import { GroupService, TYPES, QueueService } from "../services/interfaces";
import { lazyInject } from '../common/inversify.config';
import { GroupController } from '../controllers';
import GroupsHandler from './groupsHandler';
import { PersistedQueueEntry, QueueEntry } from 'models/queueModel';
import { PersistedGroup } from 'models/groupModel';
import * as mongoose from 'mongoose';
import App from '../common/app';

interface SocketResponse<T> {
    data: T;
    error: boolean
}


export default class QueueHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService
    @lazyInject(GroupController)
    private controller: GroupController
    private handler: GroupsHandler = new GroupsHandler(this.IO, this.Socket);
    @lazyInject(TYPES.QueueService)
    private queueService: QueueService

    public enqueue = async (entry: QueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
        const result : SocketResponse<PersistedQueueEntry> = { error: false, data: null }
        console.log("New request!");
        try {
            console.log(entry);
            result.data = await this.queueService.createEntry(entry);
        }
        catch(error){
            result.error = true;
            console.log("Error: " + error.message);
        }
        finally {

            let foundMatch = await this.findMatch(result.data);
            while(foundMatch){
                foundMatch = await this.findMatch(await this.queueService.getHead());
            }
            return result;
        }
    }
    public dequeue = async (entry: PersistedQueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
        const result : SocketResponse<PersistedQueueEntry> = { error: false, data: null }
        try {
            result.data = await this.queueService.removeEntry(entry);
        }
        catch{
            result.error = true;
        }
        finally {
            return result;
        }
    }

    private async findMatch(newEntry: PersistedQueueEntry): Promise<boolean>{
        let fifo = await this.queueService.getEntries();
        console.log(fifo)
        if(!(fifo.length > 0)){
            return false;
        }

        const getGroupId = async (qe : PersistedQueueEntry) => {
            if (qe.users.length > 1){
                const g = await this.groupService.getGroupByUserId(qe.users[0])
                return g._id;
            }
            return "";
        }

        for (const entry of fifo) {

            if(this.IsMatching(entry, newEntry)){
                const fromGroupId = await getGroupId(newEntry); 
                const toGroupId = await getGroupId(entry)
                let group: PersistedGroup;
                let updatedEntry : PersistedQueueEntry = entry;

                if(fromGroupId === "" && toGroupId === ""){
                    const user1 = entry.users[0];
                    const user2 = newEntry.users[0]
                    let result = await this.controller.createGroup({
                        users: [user1,user2],
                        
                        game: "Counter-Strike: GO", 
                         
                        name: "MMGROUP", 
                        maxSize: 5
                    })
                    group = result;
                    updatedEntry.users = [user1,user2];
                    this.queueService.updateEntry(updatedEntry, updatedEntry._id);
                }
                else if(fromGroupId === "" && toGroupId !== ""){
                    group = await this.controller.changeGroup(newEntry.users[0], toGroupId);
                    updatedEntry.users = entry.users.concat(newEntry.users);
                }
                else if(fromGroupId !== "" && toGroupId === ""){
                    group = await this.controller.changeGroup(entry.users[0], fromGroupId);
                    updatedEntry.users = entry.users.concat(newEntry.users);
                }
                else{
                    newEntry.users.forEach(async userId => {
                        group = await this.controller.changeGroup(userId, toGroupId, fromGroupId)
                    });
                    await this.controller.removeGroup({group_id: fromGroupId});
                }
                if(group.users.length === 5){
                    await this.dequeue(entry);
                } else{
                    this.queueService.updateEntry(updatedEntry, updatedEntry._id);
                }
                await this.dequeue(newEntry);
                this.handler.emitGroupChange(group, 'joinGroup');
                this.emitGroupMade(group, "findMatch");
                return true;
            }
        }
        return false;
    }

    public emitGroupMade = (group: PersistedGroup, caller: string) => {
        group.users.forEach(userId => {
            App.SocketIdMap[userId].emit('joinedGroup', { group: group, caller: caller });    
        });
    }

    private IsMatching(firstEntry: PersistedQueueEntry, secondEntry: PersistedQueueEntry){
        const maxSize = 5;
        const isSingleUser = firstEntry.users.length === 1 || secondEntry.users.length === 1;
        const canMakeFullGroup = (firstEntry.users.length + secondEntry.users.length) === maxSize;

        if((firstEntry._id as unknown as mongoose.Types.ObjectId).equals(secondEntry._id as unknown as mongoose.Types.ObjectId)){
            return false;
        }

        if (isSingleUser || canMakeFullGroup ) {
            const sameMode = firstEntry.gameSettings.mode === secondEntry.gameSettings.mode
            const secondSatisfiesFirst = this.BSatisfiesA(firstEntry, secondEntry); 
            const firstSatisfiesSecond = this.BSatisfiesA(secondEntry, firstEntry); 
            return sameMode && secondSatisfiesFirst && firstSatisfiesSecond;
        } else {
            return false;
        }
    }
    private BSatisfiesA(a: PersistedQueueEntry, b: PersistedQueueEntry): boolean{
        const aLevel = a.gameSettings.level;
        const bLevel = b.gameSettings.level;

        return  a.gameSettings.rank === 1 
                    ? (aLevel === bLevel)
                    : a.gameSettings.rank === 2 
                        ? (aLevel < bLevel) 
                        : aLevel > bLevel 
    }

  
}