/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../lib/common/inversify.config';
import { UserController } from './../lib/controllers/userController';
import { GroupController } from './../lib/controllers/groupController';
import { ExampleController } from './../lib/controllers/exampleController';

const models: TsoaRoute.Models = {
    "IUser": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "created": { "dataType": "datetime", "required": true },
        },
    },
    "IGroup": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "game": { "dataType": "string", "required": true },
            "maxSize": { "dataType": "double", "required": true },
            "users": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "invite_id": { "dataType": "string", "required": true },
        },
    },
    "IGroupUser": {
        "properties": {
            "user_id": { "dataType": "string", "required": true },
            "group_id": { "dataType": "string", "required": true },
        },
    },
    "IResponseIGroup": {
        "properties": {
            "statuscode": { "dataType": "double", "required": true },
            "error": { "dataType": "string", "required": true },
            "data": { "ref": "IGroup", "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/users',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAllUsers.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/users/:user_id',
        function(request: any, response: any, next: any) {
            const args = {
                user_id: { "in": "path", "name": "user_id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getUserById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/users/create',
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "IUser" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserController>(UserController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.createUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/groups',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getGroups.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/groups',
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "IGroup" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.createGroup.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/groups/join',
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "IGroupUser" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.joinGroup.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/groups/leave',
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "IGroupUser" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.leaveGroup.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/groups/:group_id',
        function(request: any, response: any, next: any) {
            const args = {
                group_id: { "in": "path", "name": "group_id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getGroup.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/groups/:group_id/:invite_id',
        function(request: any, response: any, next: any) {
            const args = {
                group_id: { "in": "path", "name": "group_id", "required": true, "dataType": "string" },
                invite_id: { "in": "path", "name": "invite_id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<GroupController>(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.verifyInvite.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ExampleController>(ExampleController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.exampleRouteFunction.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });


    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
