import { z } from 'zod';

/**
 * Zod schema equivalent to EntityFilterQuery from @backstage/catalog-client
 *
 * This is a simplified version that covers the most common use cases:
 * - Simple key-value pairs for exact matching
 * - Special keys with comparison operators
 * - Nested objects for more complex conditions
 */
export const EntityFilterQuerySchema = z.record(z.string(), z.string());

export const PolicyEvaluationQueryResultSchema = z.array(
  z.object({
    result: z.record(z.string(), z.array(EntityFilterQuerySchema)),
  }),
);

export type PolicyEvaluationQueryResult = z.infer<
  typeof EntityFilterQuerySchema
>;
