import { z } from "npm:zod@3.24.2";
import { call } from "effection";

const WasmEntrySchema = z.object({
  entrypoint: z.string(),
  module: z.string(),
  annotations: z.array(z.object({
    custom: z.record(z.string(), z.unknown()).optional(),
    description: z.string().optional(),
    entrypoint: z.boolean().optional(),
    scope: z.union([
      z.literal("document"),
      z.literal("rule"),
      z.literal("package"),
      z.literal("subpackage"),
    ]).optional(),
    title: z.string().optional(),
  })).optional(),
});

const ManifestSchema = z.object({
  revision: z.string(),
  roots: z.array(z.string()),
  wasm: z.array(WasmEntrySchema),
  rego_version: z.number(),
});

export type ManifestSchemaType = z.infer<typeof ManifestSchema>;

export function* readManifest(path: string) {
  return parseManifest(yield* call(() => Deno.readTextFile(path)));
}

function parseManifest(manifest: string) {
  return ManifestSchema.parse(JSON.parse(manifest));
}
