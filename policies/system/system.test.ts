import { describe, expect, it } from "../tests/adapter.ts";
import { usePolicy, setupPolicyContext } from "../tests/helpers.ts";

describe("system", () => {
  setupPolicyContext();

  describe("query entrypoint", () => {
    it("has the entrypoint", function* () {
      const policy = yield* usePolicy();

      expect(policy.entrypoints).toHaveProperty("system/query");
    });

    it("should return the components filter", function* () {
      const policy = yield* usePolicy();

      const result = policy.evaluate({
        entity: {
          kind: "system",
          metadata: {
            name: "test-system",
          },
        },
      }, "system/query");

      expect(result).toMatchObject([{
        result: {
          components: [{
            kind: "component",
            "relations.partof": "system:default/test-system",
          }],
        },
      }]);
    });
  });

  describe("compliance rules", () => {
    it("should pass if all components are compliant", function* () {
      const policy = yield* usePolicy();
  
      const result = policy.evaluate({
        components: [
          {
            spec: {
              compliance: [{
                policy: 'no-enforced-policy-violations',
                status: "pass",
                failure_count: 0,
                total_count: 1,
              }],
            },
          },
        ],
      }, "system");
    
      expect(result).toMatchObject([{
        result: {
          compliance: [{
            policy: "all-components-compliant", 
            status: "pass",
            failure_count: 0,
            total_count: 1,
          }],
        },
      }]);
    });
  
    it("should fail if any component is not compliant", function* () {
      const policy = yield* usePolicy();
  
      const result = policy.evaluate({
        components: [
          {
            spec: {
              compliance: [{
                policy: 'no-enforced-policy-violations',
                status: "fail",
                failure_count: 1,
                total_count: 1,
              }],
            },
          },
        ],
      }, "system");
  
      expect(result).toMatchObject([{ 
        result: {
          compliance: [{
            policy: "all-components-compliant",
            status: "fail",
            failure_count: 1,
            total_count: 1,
          }],
        },
      }]);
    });
  });
});
