import { z } from 'zod';
import { zodExtendPasswordSchema } from '../utils/zodExtendPasswordSchema';

export const PasswordSchemaRefined = zodExtendPasswordSchema(z.object({}));

export type PasswordRefined = z.infer<typeof PasswordSchemaRefined>;
