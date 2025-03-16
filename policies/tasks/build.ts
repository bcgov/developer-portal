import { main, call } from "effection";
import { useBundle } from "./lib/opa.ts";
import { join } from "@std/path";
import { merge } from "./lib/yaml.ts";
import { move, emptyDir } from "@std/fs";

if (import.meta.main) {
  await main(function* () {
    const source = ".";
    const output = "../policies.bundle/";

    yield* call(() => emptyDir(output));

    const bundle = yield* useBundle(".", output);

    const policyEntitiesFile = yield* merge(source);

    yield* call(() => move(policyEntitiesFile, join(bundle.output, "policy.yaml")));
  });
}