import { describe, expect, it } from "../tests/adapter.ts";
import { usePolicy, setupPolicyContext } from "../tests/helpers.ts";

describe("alert", () => {
  setupPolicyContext();

  it("provides alert remediation for CodeQL Warnings", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              severity: "warning",
              full_description: "This is a test warning",
              help: "This is a test help",
            },
            tool: {
              name: "CodeQL",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          remediation: [
            {
              policy: "codeql-warnings",
              level: "optional",
              help: "This is a test help",
              description: "This is a test warning",
            },
          ],
        },
      }
    ]);
  });

  it("provides alert remediation for CodeQL Errors", function* () {
    const policy = yield* usePolicy();
    
    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              severity: "error",
              full_description: "This is a test error",
              help: "This is a test help",
              tags: ["security"],
            },
            tool: {
              name: "CodeQL",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          remediation: [
            {
              policy: "codeql-errors",
              level: "recommended",
              help: "This is a test help",
              description: "This is a test error",
            },
          ],
        },
      },
    ]);
  });

  it("provides alert remediation for Trivy Errors", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              severity: "error",
              full_description: "This is a test error",
              help: "This is a test help",
              tags: ["security"],
            },
            tool: {
              name: "Trivy",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          remediation: [
            {
              policy: "trivy-errors",
              level: "required",
              help: "This is a test help",
              description: "This is a test error",
            },
          ],
        },
      },
    ]);
  });

  it("provides alert remediation for Private Key Exposure", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              severity: "error",
              full_description: "This is a test error",
              help: "This is a test help",
              tags: ["secret"],
            },
            tool: {
              name: "Trivy",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          remediation: [
            {
              policy: "private-key-exposure",
              level: "enforced",
              help: "This is a test help",
              description: "This is a test error",
            },
          ],
        },
      },
    ]);
  });

  it("provides alert category for XSS", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              id: "xss",
            },
            tool: {
              name: "CodeQL",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          category: [{ id: "xss" }],
        },
      },
    ]);
  });

  it("provides alert category for Dependency Vulnerability", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: {
              tags: ["vulnerability"],
            },
            tool: {
              name: "Trivy",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          category: [{ id: "dependency-vulnerability" }],
        },
      },
    ]);
  });

  it("provides alert category for Secret", function* () {
    const policy = yield* usePolicy();

    const result = policy.evaluate({
      entity: {
        spec: {
          alert: {
            rule: { 
              tags: ["secret"],
            },
            tool: {
              name: "Trivy",
            },
          },
        },
      },
    }, "alert");

    expect(result).toMatchObject([
      {
        result: {
          category: [{ id: "secret" }],
        },
      },
    ]);
  });
});