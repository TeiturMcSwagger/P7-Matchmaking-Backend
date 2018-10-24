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
const response_1 = require("../../response/response");
const groupService_1 = require("../../services/group/groupService");
class GroupController {
    getGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupService = new groupService_1.GroupService();
            res.json(yield groupService.getGroups());
        });
    }
    createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupService = new groupService_1.GroupService();
            res.json(groupService.createGroup(req.body));
        });
    }
    joinGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupService = new groupService_1.GroupService();
            // Post request group id and username attributes is stored..
            const group_id = req.body.group_id;
            const user_id = req.body.user_id;
            // Get response from service
            let result;
            try {
                result = yield groupService.joinGroup(group_id, user_id);
            }
            catch (error) {
                result = error.message;
            }
            res.json(result);
        });
    }
    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service. 
    leaveGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupService = new groupService_1.GroupService();
            // Post request group id and username attributes is stored..
            let group_id = req.body.group_id;
            let user_id = req.body.user_id;
            // Get response from service
            let result;
            try {
                result = yield groupService.leaveGroup(group_id, user_id);
            }
            catch (error) {
                result = error.message;
            }
            // Return result
            res.json(result);
        });
    }
    getGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupService = new groupService_1.GroupService();
            var group = yield groupService.getGroup(req.params.group_id);
            var response = new response_1.Response(group);
            // Invalid group id
            if (group == null) {
                response.error = "No group exists with group id " + req.params.group_id;
                response.statuscode = 1;
            }
            // Return group obj (null if group_id does not correspond to a group in the DB)
            res.send(response);
        });
    }
    verifyInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Check if a group exists with id 'group_id'
            const groupService = new groupService_1.GroupService();
            var group = yield groupService.getGroup(req.params.group_id);
            var response = new response_1.Response(group);
            // TODO: Correctly/appropriately handle incorrect group ids
            // What should we send as response? How should we handle it in the frontend?
            if (group == null) {
                response.error = 'No groups exist with id ' + req.params.group_id;
                response.statuscode = 1;
                res.send(response);
            }
            // 2) Check if the 'invite_id' is valid for the group
            // TODO: Correctly/appropriately handle incorrect invite ids
            // Same as above: What do we send, how do we handle it in the frontend?
            if (group.invite_id != req.params.invite_id) {
                response.error = 'Invalid invite id for group with id ' + req.params.group_id;
                response.statuscode = 2;
                res.send(response);
            }
            response.error = "Joined group";
            response.data = group;
            // The group id is valid and the invite id is correct w.r.t. the group.
            // Send response to frontend to redirect the page to the "join group" url
            // The "join group" controller will handle checks such as is the group full / does the user meet the requirements
            // TODO: Handle in frontend
            res.send(response);
        });
    }
}
exports.GroupController = GroupController;
//# sourceMappingURL=groupController.js.map