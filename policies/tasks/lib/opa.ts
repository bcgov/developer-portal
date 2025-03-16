import { LoadedPolicy, loadPolicy } from "@open-policy-agent/opa-wasm";
import { join } from "@std/path";
import { call, type Operation } from "effection";
import { $ } from "zx";
import { ManifestSchemaType, readManifest } from "./manifest.ts";
import { extractTar } from "./tar.ts";
import { useLog } from "./log.ts";

export function* buildWasm(source: string, output: string) {
  yield* call(async () => {
    const result = await $`opa build -b ${source} -t wasm --output="${output}"`
      .nothrow();
    if (result.exitCode !== 0) {
      throw new Error(result.stdout);
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

  const logger = yield* useLog();

  const bundle = options?.bundle ?? (yield* call(() =>
    Deno.makeTempFile({ prefix: "opa-bundle-", suffix: ".tar.gz" })
  ));

  const output = _output ?? (yield* call(() =>
    Deno.makeTempDir({ prefix: "opa-bundle-" })
  ));

  yield* buildWasm(source, bundle);

  logger.info(`Extracting bundle from ${bundle}`);

  yield* extractTar(bundle, output);

  logger.info(`Extracted bundle to ${output}`);

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