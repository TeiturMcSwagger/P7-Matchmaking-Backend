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
        this.groupModel = mongoose.model("groups", groupModel_1.GroupSchema);
        console.log("Groups constructed!");
    }
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Returning groups!");
            return yield this.groupModel.find({}, (err, data) => {
                return data;
            });
        });
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=groupService.js.map