# METADATA
# entrypoint: true
package alert

import rego.v1

remediation contains {
	"policy": "codeql-warnings",
	"level": "optional",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
} if {
	alert := input.entity.spec.alert
	alert.rule.severity == "warning"
	alert.tool.name == "CodeQL"
}

remediation contains {
	"policy": "codeql-errors",
	"level": "recommended",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
} if {
	alert := input.entity.spec.alert
	alert.rule.severity == "error"
	"security" in alert.rule.tags
	alert.tool.name == "CodeQL"
}

remediation contains {
	"policy": "trivy-errors",
	"level": "required",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
} if {
	alert := input.entity.spec.alert
	alert.rule.severity == "error"
	"security" in alert.rule.tags
	alert.tool.name == "Trivy"
}

remediation contains {
	"policy": "private-key-exposure",
	"level": "enforced",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
} if {
	alert := input.entity.spec.alert
	alert.rule.severity == "error"
	"secret" in alert.rule.tags
	alert.tool.name == "Trivy"
}

category contains { "id": "xss" } if {
	alert := input.entity.spec.alert
	contains(alert.rule.id, "xss")
	alert.tool.name == "CodeQL"
}

category contains { "id": "dependency-vulnerability" } if {
	alert := input.entity.spec.alert
	"vulnerability" in alert.rule.tags
	alert.tool.name == "Trivy"
}

category contains { "id": "secret" } if {
	alert := input.entity.spec.alert
	"secret" in alert.rule.tags
	alert.tool.name == "Trivy"
}


