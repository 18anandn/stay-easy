import { z } from 'zod';
import { Exception } from '../data/Exception';

type FetchOptions = {
  errorMessage: string;
} & RequestInit;

type CustomFetchFuntionType = <T>(
  endPoint: string,
  schema: z.Schema<T>,
  options: FetchOptions
) => Promise<T>;

export const customFetch: CustomFetchFuntionType = async (
  endPoint,
  schema,
  options
) => {
  try {
    const { errorMessage, ...rest } = options;
    const res = await fetch(endPoint, {
      cache: 'no-cache',
      ...rest,
    });

    const data = res.status === 204 ? null : await res.json();

    if (!res.ok) {
      throw new Exception(data?.message ?? errorMessage, res.status);
    }

    const returnData = schema.parse(data);
    return returnData;
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
      throw new Exception('There was an unknown server error', 500);
    }
    throw new Exception('Unknown error occured', -1);
  }
};
