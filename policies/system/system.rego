# METADATA
# entrypoint: true
package system

import rego.v1

import data.helpers

# METADATA
# entrypoint: true
query := {"components": [{"kind": "component", "relations.partof": helpers.entity_ref(kind, namespace, name)}]} if {
	kind := input.entity.kind
	namespace := object.get(input.entity.metadata, "namespace", "default")
	name := input.entity.metadata.name
}

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
