import { z } from 'zod';
import { StatsSchema } from './Stats';

export const StatsWithTotalSchema = StatsSchema.extend({
  total: z.number({ coerce: true }),
});
