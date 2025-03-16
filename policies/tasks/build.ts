import { main, call } from "effection";
import { useBundle } from "./lib/opa.ts";
import { join } from "@std/path";
import { merge } from "./lib/yaml.ts";
import { move, emptyDir } from "@std/fs";
import { withLogger } from "./lib/log.ts";

if (import.meta.main) {
  await main(function* () {
    const source = ".";
    const output = "../policies.bundle/";

    yield* call(() => emptyDir(output));

    const bundle = yield* withLogger("useBundle", () => useBundle(".", output));

    const policyEntitiesFile = yield* withLogger("merge", () => merge(source));

    yield* call(() => move(policyEntitiesFile, join(bundle.output, "policy.yaml")));
  });
}