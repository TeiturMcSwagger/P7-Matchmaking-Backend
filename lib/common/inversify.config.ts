import { Container, inject, injectable, decorate, interfaces } from "inversify";
import {
  autoProvide,
  makeProvideDecorator,
  makeFluentProvideDecorator
} from "inversify-binding-decorators";
import { Controller } from "tsoa";
import {
  BookService,
  GroupService,
  TYPES,
  UserService
} from "../services/interfaces";
import {
  MongoUserService,
  MongoGroupService,
  ExampleService
} from "../services";

decorate(injectable(), Controller);

type Identifier =
  | string
  | symbol
  | interfaces.Newable<any>
  | interfaces.Abstract<any>;

const iocContainer = new Container();

iocContainer.bind<BookService>(TYPES.BookService).to(ExampleService);
iocContainer.bind<GroupService>(TYPES.GroupService).to(MongoGroupService);
iocContainer.bind<UserService>(TYPES.UserService).to(MongoUserService);

const provide = makeProvideDecorator(iocContainer);
const fluentProvider = makeFluentProvideDecorator(iocContainer);

const provideNamed = (identifier: Identifier, name: string) => fluentProvider(identifier).whenTargetNamed(name).done();

const provideSingleton = (identifier: Identifier) => fluentProvider(identifier).inSingletonScope().done();

export { iocContainer, autoProvide, provide, provideSingleton, provideNamed, inject, decorate, injectable };

