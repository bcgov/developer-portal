import { z } from 'zod';

export const SystemResultSchema = z.object({
  compliance: z.array(
    z.object({
      policy: z.string(),
      status: z.string(),
      failure_count: z.number(),
      total_count: z.number(),
    }),
  ).optional(),
});
