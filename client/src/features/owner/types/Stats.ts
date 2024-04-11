import { z } from 'zod';

export const StatsSchema = z.object({
  min: z.number(),
  avg: z.number(),
  max: z.number(),
});

export type Stats = z.infer<typeof StatsSchema>;
