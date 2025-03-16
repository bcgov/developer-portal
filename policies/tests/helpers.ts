import { createContext } from "effection";
import { beforeEach } from "./adapter.ts";
import { Bundle, useBundle } from "../tasks/lib/opa.ts";

import { normalize, relative } from "@std/path";

function getSource() {
  return normalize(
    relative(new URL("../", import.meta.url).pathname, Deno.cwd()),
  );
}

const PolicyContext = createContext<Bundle>("policy");

export function* usePolicy() {
  const { policy } = yield* PolicyContext.expect();
  return policy;;
}

export function setupPolicyContext() {
  beforeEach(function* () {
    yield* PolicyContext.set(yield* useBundle(getSource()));
  });
}