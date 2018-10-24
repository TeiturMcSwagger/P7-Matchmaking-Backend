import { Container } from "inversify";
import {BookService, GroupService, TYPES} from "../services/interfaces"
import {ExampleService} from "../services/example/exampleService"
import {MongoGroupService} from "../services/group/mongoGroupService"

const AppContainer = new Container();
AppContainer.bind<BookService>(TYPES.BookService).to(ExampleService)
AppContainer.bind<GroupService>(TYPES.GroupService).to(MongoGroupService)

export { AppContainer };
