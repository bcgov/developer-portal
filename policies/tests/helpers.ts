import { normalize, relative } from "@std/path";
import { createContext } from "effection";
import { pino } from "pino";

import { LogContext } from "../tasks/lib/log.ts";
import { Bundle, useBundle } from "../tasks/lib/opa.ts";
import { beforeEach } from "./adapter.ts";

function getSource() {
  return normalize(
    relative(new URL("../", import.meta.url).pathname, Deno.cwd()),
  );
}

const PolicyContext = createContext<Bundle>("policy");

export function* usePolicy() {
  const { policy } = yield* PolicyContext.expect();
  return policy;
}

export function setupPolicyContext() {
  beforeEach(function* () {
    yield* LogContext.set(pino({ level: "error" }));
    yield* PolicyContext.set(yield* useBundle(getSource()));
  });
}
