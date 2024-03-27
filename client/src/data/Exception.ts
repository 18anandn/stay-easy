export class Exception extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super();
    super.message = message ?? 'There was an error';
  }
}