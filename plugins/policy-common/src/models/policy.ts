import { z } from 'zod';
import { KindValidator } from '@backstage/catalog-model';

export const POLICY_KIND = 'Policy';
export const POLICY_VERSION = ['bc-gov/policyv1'] as const;
export const POLICY_TYPES = [
  'security',
  'best-practice',
  'code-quality',
] as const;
export const POLICY_LEVELS = [
  'optional',
  'recommended',
  'required',
  'strictly-enforced',
] as const;

const policySchema = z.object({
  apiVersion: z.enum(POLICY_VERSION),
  kind: z.literal(POLICY_KIND),
  metadata: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  spec: z.object({
    type: z.enum(POLICY_TYPES),
    level: z.enum(POLICY_LEVELS),
  }),
});

export type Policy = z.infer<typeof policySchema>;

export const policyValidator: KindValidator = {
  async check(entity) {
    try {
      await policySchema.parseAsync(entity);
      return true;
    } catch (e) {
      throw new Error(`Policy validation failed: ${e}`);
    }
  },
};
