# METADATA
# entrypoint: true
package component

import rego.v1

# Compliance result
compliance contains {
	"policy": "no-enforced-policy-violations",
	"status": status,
	"failure_count": enforced_remediations,
	"total_count": total,
} if {
	total := count([x | some x in input.alerts[_].spec.remediation])

	# Count of enforced remediations
	enforced_remediations := count([alert |
		some alert in input.alerts
		some remediation in alert.spec.remediation
		remediation.level == "enforced"
	])

	# Determine status based on enforced remediations count
	status := calc_status(enforced_remediations)
}

# Helper function to calculate status
calc_status(x) := "pass" if x == 0

calc_status(x) := "fail" if x > 0
