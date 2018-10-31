import { Request, Response } from "express";

import { BookService, TYPES } from "../services/interfaces";
import { Get, Tags, Route, Controller } from "tsoa";
import { provideSingleton, inject } from "../common/inversify.config";

@Tags("example")
@Route("")
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
