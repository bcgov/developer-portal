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
  location: string;
}

export function* useBundle(
  source: string,
  { bundle, destination }: { bundle?: string; destination?: string },
): Operation<Bundle> {
  if (!bundle) {
    bundle = yield* call(() =>
      Deno.makeTempFile({ prefix: "opa-bundle-", suffix: ".tar.gz" })
    );
  }
  if (!bundle) throw new Error("Failed to build bundle.");
  console.log(`Building bundle ${source}`);

  yield* buildWasm(source, bundle);

  console.log(`Extracting bundle from ${bundle}`);

  if (!destination) {
    destination = yield* call(() =>
      Deno.makeTempDir({ prefix: "opa-bundle-" })
    );
  }

  yield* extractTar(bundle, destination);

  console.log(`Extracted bundle to ${destination}`);

  const manifest = yield* readManifest(join(destination, ".manifest"));
  const file = yield* call(() =>
    Deno.readFile(join(destination, "policy.wasm"))
  );
  const policy = yield* readPolicy(file.buffer.slice(0, file.length));

  return {
    policy,
    manifest,
    location: destination,
  };
}
