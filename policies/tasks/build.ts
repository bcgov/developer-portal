import { main, call } from "effection";
import { useBundle } from "./lib/opa.ts";
import { relative, normalize, join } from "@std/path";
import { merge } from "./lib/yaml.ts";
import { move } from "@std/fs";

if (import.meta.main) {
  await main(function* () {
    const source = normalize(relative(new URL('../', import.meta.url).pathname, Deno.cwd()))

    const bundle = yield* useBundle(source);

    const policyEntitiesFile = yield* merge(source);

    yield* call(() => move(policyEntitiesFile, join(bundle.location, "policy.yaml")));
  });
}
