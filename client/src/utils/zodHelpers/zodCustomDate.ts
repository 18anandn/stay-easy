import { z } from 'zod';
import { toUTCDate } from '../dates/toUTCDate';

export const zodCustomDate = () => z
  .date({ coerce: true })
  .transform((val) => toUTCDate(val));
