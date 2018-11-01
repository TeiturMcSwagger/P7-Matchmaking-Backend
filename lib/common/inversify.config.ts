import { Container } from "inversify";
import {BookService, GroupService, UserService, TYPES} from "../services/interfaces";
import {ExampleService} from "../services/example/exampleService";
import {MongoGroupService} from "../services/group/mongoGroupService";
import {MongoUserService} from "../services/users/mongoUserService";


const AppContainer = new Container();
AppContainer.bind<BookService>(TYPES.BookService).to(ExampleService);
AppContainer.bind<GroupService>(TYPES.GroupService).to(MongoGroupService);
AppContainer.bind<UserService>(TYPES.UserService).to(MongoUserService);

export { AppContainer };
