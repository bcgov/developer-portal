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
import { z } from "npm:zod@3.24.2";
import { $ } from "npm:zx@8.4.0";

await $`mkdir -p bundle`;
await $`opa build -b policies -t wasm -e bcgov/security --ignore="*test*"`;
await $`tar -xvf bundle.tar.gz -C bundle`;

const WasmEntrySchema = z.object({
  entrypoint: z.string(),
  module: z.string(),
});

const ManifestSchema = z.object({
  revision: z.string(),
  roots: z.array(z.string()),
  wasm: z.array(WasmEntrySchema),
  rego_version: z.number(),
});

const manifest = ManifestSchema.parse(
  JSON.parse(await Deno.readTextFile("./bundle/.manifest")),
);

const [policy] = await Promise.all(manifest.wasm.map(async (wasm) => {
  const policyWasm = await Deno.readFile(join("bundle", wasm.module));
  return {
    policy: await loadPolicy(policyWasm),
    entrypoint: wasm.entrypoint,
  };
}));

console.log(policy.policy.evaluate({
  entity: {
    kind: "system",
  },
}));
