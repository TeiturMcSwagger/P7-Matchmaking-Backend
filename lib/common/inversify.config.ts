import { Container } from "inversify";
import {BookService, GroupService, TYPES, UserService} from "../services/interfaces"
import {ExampleService} from "../services/exampleService"
import {MongoGroupService} from "../services/mongoGroupService"
import { MongoUserService } from "../services/mongoUserService";

const AppContainer = new Container();
AppContainer.bind<BookService>(TYPES.BookService).to(ExampleService)
AppContainer.bind<GroupService>(TYPES.GroupService).to(MongoGroupService)
AppContainer.bind<UserService>(TYPES.UserService).to(MongoUserService)

// const gs = AppContainer.get<GroupService>(TYPES.GroupService);
// const us = AppContainer.get<UserService>(TYPES.UserService);
// console.log(gs);
// console.log(us);

export { AppContainer };
