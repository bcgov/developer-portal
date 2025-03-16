# METADATA
# entrypoint: true
package system

import data.system.query

import rego.v1

import data.helpers

# Compliance result
compliance contains {
	"policy": "all-components-compliant",
	"status": status,
	"failure_count": failure_count,
	"total_count": total_count,
} if {
	failure_count := count([compliance |
		some components in input.components
		some compliance in components.spec.compliance
		compliance.status == "fail"
	])
	total_count := count([compliance |
		some components in input.components
		some compliance in components.spec.compliance
	])
	status := helpers.calc_status(failure_count)
}
