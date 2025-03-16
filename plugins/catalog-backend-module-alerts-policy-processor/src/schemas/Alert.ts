import { z } from 'zod';

export const RemediationResultSchema = z.object({
  policy: z.string(),
  level: z.string(),
  help: z.string(),
  description: z.string(),
});

export const AlertCategoryIdSchema = z.enum([
  'xss',
  'dependency-vulnerability',
  'secret',
  'private-key-exposure',
]);

export const AlertCategorySchema = z.object({
  id: AlertCategoryIdSchema,
});

export const AlertResultSchema = z.object({
  category: z.array(AlertCategorySchema),
  remediation: z.array(RemediationResultSchema),
});
