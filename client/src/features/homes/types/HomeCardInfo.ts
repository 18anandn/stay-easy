import { z } from 'zod';

export const HomeCardInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number({ coerce: true }),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  images: z.string().url().array(),
});

export type HomeCardInfo = z.infer<typeof HomeCardInfoSchema>;
