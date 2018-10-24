"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const groupModel_1 = require("../../models/groups/groupModel");
mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });
class GroupService {
    constructor() {
        this.groupsModel = mongoose.model("groups", groupModel_1.GroupSchema);
    }
    getGroups() {
        return this.groupsModel.find();
    }
    createGroup(group) {
        return this.groupsModel.create(group);
    }
    getGroup(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let group;
            try {
                group = yield this.groupsModel.findById(group_id, function (err, adventure) { });
            }
            catch (e) {
                group = null;
            }
            finally {
                return group;
            }
        });
    }
    joinGroup(group_id, user_id) {
        return this.groupsModel.updateOne({ _id: group_id }, { $push: { users: user_id } });
    }
    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    leaveGroup(group_id, user_id) {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return this.groupsModel.updateOne({ _id: group_id }, { $pull: { users: { $in: [user_id] } } });
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=groupService.js.map