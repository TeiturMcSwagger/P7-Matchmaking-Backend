import { QueueEntry, PersistedQueueEntry } from "models/queueModel";
import { PersistedGroup, Group, IGame, GroupCreateBody, GroupUser, IdPair } from "models/groupModel";

export interface QueueBusinessLogic{
    createEntry(queueEntry: QueueEntry): Promise<PersistedQueueEntry>;
    findMatch(backEntry: PersistedQueueEntry): Promise<{ couldMatch: boolean, grp: PersistedGroup }>;
    removeEntry(e: PersistedQueueEntry) : Promise<PersistedQueueEntry>;
}
export interface GroupBusinessLogic{
    getGroups(): Promise<Group[]>;
    getFittingGroups(available_spots: number, game: string): Promise<Group[]>;
    getGameList(): Promise<IGame[]>;
    createGroup(body: GroupCreateBody): Promise<PersistedGroup>;
    joinGroup(body: GroupUser): Promise<any>;
    leaveGroup(body: GroupUser): Promise<PersistedGroup>;
    changeGroup(user_id: string, group_id: string, old_group_id: string): Promise<PersistedGroup>;
    getGroup(group_id: string): Promise<PersistedGroup>;
    verifyInvite(group_id: string, invite_id: string): Promise<Group>; 
    mergeTwoGroups(body: IdPair): Promise<Group>;
    updateVisibility(body: PersistedGroup): Promise<PersistedGroup>;
    removeGroup(body: { group_id: string }): Promise<Group>;
}


export const BUSINESSTYPES = {
    QueueBusinessLogic: Symbol.for("QueueBusinessLogic"),
    GroupBusinessLogic: Symbol.for("GroupBusinessLogic"),
};