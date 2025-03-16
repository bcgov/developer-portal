import { describe, expect, it } from "../tests/adapter.ts";
import { setupPolicyContext, usePolicy } from "../tests/helpers.ts";

describe("component", () => {
  setupPolicyContext();

  describe("component/query entrypoint", () => {
    it("is defined", function* () {
      const policy = yield* usePolicy();

      expect(policy.entrypoints).toHaveProperty("component/query");
    });

    it("should handle entities without namespace", function* () {
      const policy = yield* usePolicy();

      const result = policy.evaluate({
        entity: {
          kind: "component",
          metadata: {
            name: "test-no-namespace",
          },
        },
      }, "component/query");

      expect(result).toMatchObject([{
        result: {
          alerts: [{
            kind: "alert",
            "relations.forComponent": "component:default/test-no-namespace",
          }],
        },
      }]);
    });

    it("should return the filters", function* () {
      const policy = yield* usePolicy();

      const result = policy.evaluate({
        entity: {
          kind: "component",
          metadata: {
            namespace: "xyz",
            name: "test",
          },
        },
      }, "component/query");

      expect(result).toMatchObject([{
        result: {
          alerts: [{
            kind: "alert",
            "relations.forComponent": "component:xyz/test",
          }],
        },
      }]);
    });
  });

  describe("policy evaluation", () => {
    it("should pass if there are no enforced policy violations", function* () {
      const policy = yield* usePolicy();

      const result = policy.evaluate({
        alerts: [
          {
            spec: {
              remediation: [{
                level: "optional",
              }],
            },
          },
        ],
      }, "component");

      expect(result).toMatchObject([{
        result: {
          compliance: [{
            policy: "no-enforced-policy-violations",
            status: "pass",
            failure_count: 0,
            total_count: 1,
          }],
        },
      }]);
    });
  });
});
