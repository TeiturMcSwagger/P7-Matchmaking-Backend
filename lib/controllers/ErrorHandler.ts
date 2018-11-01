export interface ErrorType {
  statusCode: number;
  name: string;
  message: string;
  fields?: { [field: string]: { message: string } };
}

export class ApiError extends Error implements ErrorType {
  public statusCode: number = 500;
  public fields?: { [field: string]: { message: string } };

  constructor(errorType: ErrorType) {
    super(errorType.message);
    this.name = errorType.name;
    if (errorType.statusCode) this.statusCode = errorType.statusCode;
    this.fields = errorType.fields;
  }
}
