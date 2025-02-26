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

// Tool schema
const ToolSchema = z.object({
  name: z.string(),
  alerts: z.number().optional(),
});

// Compliance data point schema
const ComplianceDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}$/),
  pass: z.number().min(0),
  fail: z.number().min(0),
});

// Scope data point schema
const ScopeDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}$/),
  total: z.number().min(0),
  affected: z.number().min(0),
});

// Ministry compliance data schema
const MinistryComplianceSchema = z.object({
  name: z.string(),
  compliance_rate: z.number().min(0).max(100),
  policies_passed: z.number().min(0),
  policies_total: z.number().min(0),
});

// Ministry compliance groups schema
const MinistryComplianceGroupsSchema = z.object({
  best_performing: z.array(MinistryComplianceSchema),
  needs_improvement: z.array(MinistryComplianceSchema),
});

// Policy spec schema
const PolicySpecSchema = z.object({
  type: z.enum(POLICY_TYPES),
  level: z.enum(POLICY_LEVELS),
  tools: z.array(ToolSchema),
  compliance: z.array(ComplianceDataSchema),
  scope: z.array(ScopeDataSchema),
  ministry_compliance: MinistryComplianceGroupsSchema,
});

// Main policy schema
export const PolicySchema = z.object({
  apiVersion: z.literal('bc-gov/policyv1'),
  kind: z.literal('Policy'),
  metadata: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  spec: PolicySpecSchema,
});

// Type for a validated policy
export type Policy = z.infer<typeof PolicySchema>;

export const policyValidator: KindValidator = {
  async check(entity) {
    try {
      await PolicySchema.parseAsync(entity);
      return true;
    } catch (e) {
      throw new Error(`Policy validation failed: ${e}`);
    }
  },
};
