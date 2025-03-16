import { z } from 'zod';
import { AlertResultSchema } from './Alert';
import { ComponentResultSchema } from './Component';

export const PolicyEvaluationResultSchema = z.array(
  z.object({
    result: z.record(
      z.string(),
      z.array(z.union([AlertResultSchema, ComponentResultSchema])),
    ),
  }),
);
