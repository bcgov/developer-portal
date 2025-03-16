import { LoadedPolicy, loadPolicy } from "@open-policy-agent/opa-wasm";
import { join } from "@std/path";
import { call, type Operation } from "effection";
import { $ } from "zx";
import { ManifestSchemaType, readManifest } from "./manifest.ts";
import { extractTar } from "./tar.ts";

export function* buildWasm(source: string, output: string) {
  yield* call(async () => {
    const result = await $`opa build -b ${source} -t wasm --output="${output}"`
      .nothrow();
    if (result.exitCode !== 0) {
      console.error(result.stdout);
    }
    return result.stdout;
  });
}

export function* readPolicy(
  regoWasm: BufferSource | WebAssembly.Module | Response | Promise<Response>,
  memoryDescriptor?: number | WebAssembly.MemoryDescriptor,
  customBuiltins?: {
    // deno-lint-ignore ban-types
    [builtinName: string]: Function;
  },
) {
  return yield* call(() =>
    loadPolicy(regoWasm, memoryDescriptor, customBuiltins)
  );
}

export interface Bundle {
  policy: LoadedPolicy;
  manifest: ManifestSchemaType;
  output: string;
}

export function* useBundle(
  source: string,
  _output?: string,
  options?: { bundle?: string; },
): Operation<Bundle> {
  const bundle = options?.bundle ?? (yield* call(() =>
    Deno.makeTempFile({ prefix: "opa-bundle-", suffix: ".tar.gz" })
  ));

  const output = _output ?? (yield* call(() =>
    Deno.makeTempDir({ prefix: "opa-bundle-" })
  ));

  if (!bundle) throw new Error("Failed to build bundle.");
  console.log(`Building bundle ${source}`);

  yield* buildWasm(source, bundle);

  console.log(`Extracting bundle from ${bundle}`);

  yield* extractTar(bundle, output);

  console.log(`Extracted bundle to ${output}`);

  const manifest = yield* readManifest(join(output, ".manifest"));

  const file = yield* call(() =>
    Deno.readFile(join(output, "policy.wasm"))
  );

  const policy = yield* readPolicy(file.buffer.slice(0, file.length));

  return {
    policy,
    manifest,
    output,
  };
}
