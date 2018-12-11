import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService, QueueService } from "../services/interfaces";
import { lazyInject } from '../common/inversify.config';
import { GroupController } from '../controllers';
import GroupsHandler from './groupsHandler';
import { PersistedQueueEntry, QueueEntry } from 'models/queueModel';
import { equal } from 'assert';
import { Game } from 'discord.js';
import { PersistedGroup } from 'models/groupModel';

interface SocketResponse<T> {
    data: T;
    error: boolean
}


export default class QueueHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService
    @lazyInject(GroupController)
    private controller: GroupController
    @lazyInject(GroupsHandler)
    private handler: GroupsHandler
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

            console.log(result);
            return result;
        }
    }
    public dequeue = async (entry: QueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
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

                if(fromGroupId === "" && toGroupId === ""){
                    const user1 = entry.users[0];
                    const user2 = newEntry.users[0]
                    let result = await this.handler.createGroup({
                        users: [user1,user2],
                        invite_id: "",
                        visible: false,
                        game: "Counter-Strike: GO", 
                        discordChannels: [], 
                        name:"", 
                        maxSize: 5
                    })
                    group = result.data;
                    const updatedEntry = entry;
                    updatedEntry.users = [user1,user2];
                    this.queueService.updateEntry(updatedEntry, updatedEntry._id);
                }
                else if(fromGroupId === "" && toGroupId !== ""){
                    group = await this.controller.changeGroup(newEntry.users[0], toGroupId);
                    await this.dequeue(entry);

                }
                else if(fromGroupId !== "" && toGroupId === ""){
                    group = await this.controller.changeGroup(entry.users[0], fromGroupId);
                    await this.dequeue(entry);
                }
                else{
                    newEntry.users.forEach(async userId => {
                        group = await this.controller.changeGroup(userId, toGroupId, fromGroupId)
                    });
                    await this.dequeue(entry);
                    await this.controller.removeGroup({group_id: fromGroupId});
                }
                await this.dequeue(newEntry);
                this.emitGroupMade(group, "findMatch");
                return true;
            }
        }
        return false;
    }

    public emitGroupMade = (group: PersistedGroup, caller: string) => {
        group.users.forEach(userId => {
            this.emitter(this.IO.to(userId), 'joinedGroup', { group: group, caller: caller });    
        });
    }

    private IsMatching(firstEntry: PersistedQueueEntry, secondEntry: PersistedQueueEntry){
        const maxSize = 5;
        const isSingleUser = firstEntry.users.length === 1 || secondEntry.users.length === 1;
        const canMakeFullGroup = (firstEntry.users.length + secondEntry.users.length) === maxSize;

        if(firstEntry === secondEntry){
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