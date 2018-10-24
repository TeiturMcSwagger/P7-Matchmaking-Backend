import { Container } from "inversify";
import {BookService, TYPES} from "../services/interfaces"
import {ExampleService} from "../services/example/exampleService"

const AppContainer = new Container();
AppContainer.bind<BookService>(TYPES.BookService).to(ExampleService)

export { AppContainer };
