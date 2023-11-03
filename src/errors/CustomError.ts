export enum Errors {
  File = 'file',
}

type ErrorType = `${Errors}`;

export class CustomError extends Error {
  constructor(
    public readonly type: ErrorType,
    public readonly message: string,
  ) {
    console.log(message);
    super(message);
  }
}
