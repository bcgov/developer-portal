import { z } from 'zod';
import { AlertResultSchema } from './Alert';
import { ComponentResultSchema } from './Component';
import { SystemResultSchema } from './System';

export const PolicyEvaluationResultSchema = z.array(
  z.object({
    result: z.union([AlertResultSchema, ComponentResultSchema, SystemResultSchema]),
  }),
);
