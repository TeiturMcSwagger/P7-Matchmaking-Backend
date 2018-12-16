import { Request, Response } from "express";

import { BookService, TYPES } from "../services/interfaces";
import { Get, Tags, Route, Controller } from "tsoa";
import { inject, provideSingleton } from "../common/inversify.config";
import { provide } from "inversify-binding-decorators";


@Tags("example")
@Route("api")
@provideSingleton(ExampleController)
export class ExampleController extends Controller {
  constructor(@inject(TYPES.BookService) private bookService: BookService) {
    super();
  }

  @Get()
  public async exampleRouteFunction(): Promise<any> {
    return await this.bookService.getAllBooks();
  }
}
