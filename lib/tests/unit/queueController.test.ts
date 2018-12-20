import "reflect-metadata";
import { QueueController } from "../../controllers/queueController";
import { QueueService, GroupService } from "../../services/interfaces";
import { GroupBusinessLogic } from "../../controllers/interfaces";
import { PersistedQueueEntry, Rank, Level, Mode, QueueEntry } from "../../models/queueModel";
import * as mongoose from 'mongoose';
import { PersistedGroup } from "models/groupModel";


describe('QueueController tests', () => {

    let QueueServiceMock : jest.Mock<QueueService>
    let GroupServiceMock : jest.Mock<GroupService>
    let GroupLogicMock : jest.Mock<GroupBusinessLogic>
    const setupMock = (testQueue) => {
        QueueServiceMock = jest.fn<QueueService>(() =>{
            return {
                getEntries: jest.fn().mockReturnValue(testQueue),
                createEntry: jest.fn().mockImplementation((e: QueueEntry):PersistedQueueEntry => {
                    return {
                        _id: mongoose.Types.ObjectId() as unknown as string, users: e.users, gameSettings: e.gameSettings
                    }
                }),
                updateEntry: jest.fn().mockImplementation(),
                removeEntry: jest.fn(),
            };
        })
        GroupServiceMock = jest.fn<GroupService>(() =>{
            return {
                getGroupByUserId: jest.fn().mockReturnValue(""),
            };
        });
        GroupLogicMock = jest.fn<GroupBusinessLogic>(() => {
            return {
                createGroup: jest.fn().mockImplementation((grp) => grp),
            }
        });
    }

    it('Should find a match with an entry B (THAT SATISFY A, and vice versa) in queue', async () => {

        // Arrange

        const queueRepository : PersistedQueueEntry[] = [
/* B */     {_id: mongoose.Types.ObjectId() as unknown as string, users: ["USER1"], gameSettings: {rank: Rank.ABOVE, level: Level.GOLDNOVA1, mode: Mode.COMPETITIVE}},
        ]

/* A */ const entry : PersistedQueueEntry= { _id: mongoose.Types.ObjectId() as unknown as string, users: ["USER2"], gameSettings: {rank: Rank.BELOW, level: Level.GLOBALELITE, mode: Mode.COMPETITIVE}}

        setupMock(queueRepository);

        const queueServiceMock = new QueueServiceMock();
        const groupServiceMock = new GroupServiceMock();
        const groupLogicMock = new GroupLogicMock();


        const sut = new QueueController(queueServiceMock, groupServiceMock, groupLogicMock);

        // Act 
        const res = await sut.findMatch(entry);
        
        // Assert 
        expect(res.couldMatch).toBe(true);
        expect(res.grp.users.length).toBe(2);
        expect(res.grp.users[0]).toBe(queueRepository[0].users[0]);
        expect(res.grp.users[1]).toBe(entry.users[0]);
        expect(groupLogicMock.createGroup).toBeCalledTimes(1);

    
    })

    it('Should not find a match with an entry B (THAT NOT SATISFY A) in queue', async () => {

        // Arrange

        const queueRepository : PersistedQueueEntry[] = [
/* B */     {_id: mongoose.Types.ObjectId() as unknown as string, users: ["USER1"], gameSettings: {rank: Rank.ABOVE, level: Level.GOLDNOVA1, mode: Mode.COMPETITIVE}},
        ]

/* A */ const entry : PersistedQueueEntry= { _id: mongoose.Types.ObjectId() as unknown as string, users: ["USER2"], gameSettings: {rank: Rank.SAME, level: Level.GLOBALELITE, mode: Mode.COMPETITIVE}}
            
        setupMock(queueRepository);

        const queueServiceMock = new QueueServiceMock();
        const groupServiceMock = new GroupServiceMock();
        const groupLogicMock = new GroupLogicMock();


        const sut = new QueueController(queueServiceMock, groupServiceMock, groupLogicMock);

        // Act 
        const res = await sut.findMatch(entry);
        
        // Assert 
        expect(res.couldMatch).toBe(false);
        expect(res.grp).toBe(null);
        expect(groupLogicMock.createGroup).toBeCalledTimes(0);
    })

    it('Should not find a match with an entry B (WHERE A DO NOT SATISFY B) in queue', async () => {

        // Arrange

        const queueRepository : PersistedQueueEntry[] = [
/* B */     {_id: mongoose.Types.ObjectId() as unknown as string, users: ["USER1"], gameSettings: {rank: Rank.SAME, level: Level.GOLDNOVA1, mode: Mode.COMPETITIVE}},
        ]

/* A */ const entry : PersistedQueueEntry= { _id: mongoose.Types.ObjectId() as unknown as string, users: ["USER2"], gameSettings: {rank: Rank.BELOW, level: Level.GLOBALELITE, mode: Mode.COMPETITIVE}}

        setupMock(queueRepository);

        const queueServiceMock = new QueueServiceMock();
        const groupServiceMock = new GroupServiceMock();
        const groupLogicMock = new GroupLogicMock();


        const sut = new QueueController(queueServiceMock, groupServiceMock, groupLogicMock);

        // Act 
        const res = await sut.findMatch(entry);
        
        // Assert 
        expect(res.couldMatch).toBe(false);
        expect(res.grp).toBe(null);
        expect(groupLogicMock.createGroup).toBeCalledTimes(0);
    })



    it('Should create a queue entry', () => {

        // Arrange

        const entry : QueueEntry = { users: ["USER1"], gameSettings: {rank: Rank.BELOW, level: Level.GLOBALELITE, mode: Mode.COMPETITIVE}}

        setupMock(null);

        const queueServiceMock = new QueueServiceMock();
        const groupServiceMock = new GroupServiceMock();
        const groupLogicMock = new GroupLogicMock();


        const sut = new QueueController(queueServiceMock, groupServiceMock, groupLogicMock);

        
        // Act
        sut.createEntry(entry);

        // Assert
        expect(queueServiceMock.createEntry).toBeCalledWith(entry);
        expect(queueServiceMock.createEntry).toBeCalledTimes(1);
    })
})