import { describe, expect, it } from "../tests/adapter.ts";
import { usePolicy, setupPolicyContext } from "../tests/helpers.ts";

describe("component", () => {
  setupPolicyContext();

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
          status: "pass" ,
          failure_count: 0,
          total_count: 1,
        }],
      }
    }]);
  });
});