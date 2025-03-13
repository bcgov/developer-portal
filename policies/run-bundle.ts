#!/usr/bin/env -S deno run -A
/**
 * This script expects a bundle to be present in the root directory.
 * You can build a bundle using the `yarn build:policies` script.
 * Then extract the bundle into the `bundle` directory by running:
 *
 * ```bash
 * yarn build:policies
 * tar -xvf bundle.tar.gz
 * ```
 */

import { loadPolicy } from "npm:@open-policy-agent/opa-wasm@1.10.0";
import { join } from "node:path";
import { any, z } from "npm:zod@3.24.2";
import { $, within } from "npm:zx@8.4.0";

const source = "policies/";
const built = "policies.bundle/";
const bundle = `${built}bundle.tar.gz`;

await $`mkdir -p ${built}`;
await within(async () => {
  $.cwd = source;
  try {
    await $`opa build -b . -t wasm --ignore="*test*" --output="../${bundle}"`;
  } catch (error) {
    console.error(error);
  }
});
await $`tar -xvf ${bundle} -C ${built}`;
await $`rm ${bundle}`;

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
  })),
});

const ManifestSchema = z.object({
  revision: z.string(),
  roots: z.array(z.string()),
  wasm: z.array(WasmEntrySchema),
  rego_version: z.number(),
});

const manifest = ManifestSchema.parse(
  JSON.parse(await Deno.readTextFile(`${built}/.manifest`)),
);

const [wasm] = manifest.wasm;

const policyWasm = await Deno.readFile(join(built, wasm.module));
const policy = await loadPolicy(policyWasm);

manifest.wasm.forEach((wasm) => {
  console.log(`Entrypoint: ${wasm.entrypoint}`);

  const [result1] = policy.evaluate({
    entity: {
      kind: "system",
    },
  }, wasm.entrypoint);
  if (result1 && result1.result) {
    console.log(result1);
  }

  const [result2] = policy.evaluate({
    entity: {
      kind: "component",
      relations: {
        partOf: "system:default/finance-portal",
      },
    },
  }, wasm.entrypoint);
  if (result2 && result2.result) {
    console.dir(result2);
  }
});
