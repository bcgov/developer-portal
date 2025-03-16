import { walk } from "@std/fs";
import { globToRegExp } from "@std/path";
import { call, each, stream } from "effection";
import { Document, parseAllDocuments } from "@eemeli/yaml";
import { useLog } from "./log.ts";

export function* merge(source: string) {
  const logger = yield* useLog();
  
  const reg = globToRegExp("**/*.yaml", {
    globstar: true,
  });

  const files = walk(source, {
    includeDirs: false,
    includeFiles: true,
    match: [
      reg,
    ],
  });

  const file = yield* call(() => Deno.makeTempFile({ suffix: ".yaml" }));
  const documents: Document[] = [];

  for (const entry of yield* each(stream(files))) {
    const content = yield* call(() => Deno.readTextFile(entry.path));
    const docs = parseAllDocuments(content);
    docs.forEach((doc) => {
      if (doc.errors.length > 0) {
        logger.error(
          `${entry.path}: ${doc.errors.map((e) => e.message).join(", ")}`,
        );
      }
    });
    documents.push(...docs);
    yield* each.next();
  }

  // Combine all documents with separators and write to temp file
  const combined = documents.map((doc) => doc.toString().replace(/^\n*---\n*/, ""))
    .join("---\n");
  yield* call(() => Deno.writeTextFile(file, combined));

  return file;
}
