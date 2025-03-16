import { call, each, stream, type Operation } from "effection";
import { UntarStream } from "@std/tar/untar-stream";
import { dirname, join, normalize } from "@std/path";
import { useLog } from "./log.ts";

export function* extractTar(archive: string, destination: string): Operation<void> {
  const logger = yield* useLog();
  const content = yield* call(() => Deno.open(archive));

  for (
    const entry of yield* each(stream(
      content.readable
        .pipeThrough(new DecompressionStream("gzip"))
        .pipeThrough(new UntarStream()),
    ))
  ) {
    const file = normalize(entry.path);

    const path = join(destination, file);

    yield* call(() => Deno.mkdir(dirname(path), { recursive: true }));

    const dest = yield* call(() => Deno.create(path));

    yield* call(() => entry.readable?.pipeTo(dest.writable));

    logger.info(`Extracted ${file}`);

    yield* each.next();
  }

}
