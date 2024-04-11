import { z } from 'zod';
import { Exception } from '../data/Exception';

export const tryCatchWrapper = <T extends Array<unknown>, U>(
  fn: (...args: T) => Promise<U>
) => {
  return async (...args: T): Promise<U> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(error);
      if (error instanceof Exception) {
        throw error;
      }
      if (error instanceof z.ZodError) {
        throw new Exception('There was an unknown server error', 500);
      }
      if (error instanceof TypeError) {
        throw new Exception('There was a connection problem', 0);
      }
      if (error instanceof SyntaxError) {
        throw new Exception('No data received from the server', -2);
      }
      throw new Exception('Unknown error occured', -1);
    }
  };
};
