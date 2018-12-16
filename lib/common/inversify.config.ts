import { Container, inject, injectable, decorate, interfaces } from "inversify";
import {
  autoProvide,
  buildProviderModule,
  fluentProvide,
  provide,
} from "inversify-binding-decorators";
import { Controller } from "tsoa";
import {
  BookService,
  GroupService,
  TYPES,
  UserService,
  IIOService,
  QueueService
} from "../services/interfaces";
import {
  MongoUserService,
  MongoGroupService,
  ExampleService,
  MongoQueueService,
} from "../services";
import { QueueBusinessLogic, BUSINESSTYPES, GroupBusinessLogic } from "../controllers/interfaces";

import { QueueController, GroupController, DiscordController} from "../controllers";

import App from "./app";
import getDecorators from "inversify-inject-decorators";

decorate(injectable(), Controller);

type Identifier =
  | string
  | symbol
  | interfaces.Newable<any>
  | interfaces.Abstract<any>;

const iocContainer = new Container();

let provideSingleton = function(
  identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>
) {
    return fluentProvide(identifier)
      .inSingletonScope()
      .done();
};

iocContainer.bind<IIOService>(TYPES.IIOService).to(App);
iocContainer.bind<BookService>(TYPES.BookService).to(ExampleService);
iocContainer.bind<GroupService>(TYPES.GroupService).to(MongoGroupService);
iocContainer.bind<UserService>(TYPES.UserService).to(MongoUserService);
iocContainer.bind<QueueService>(TYPES.QueueService).to(MongoQueueService);


const { lazyInject } = getDecorators(iocContainer);



iocContainer.load(buildProviderModule());

export { iocContainer, provideSingleton, autoProvide, inject, decorate, injectable, lazyInject };

