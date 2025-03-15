# METADATA
# entrypoint: true
package alert

import rego.v1

# METADATA
# title: "CodeQL Warnings"
# description: "This policy identifies CodeQL warnings and provides optional remediation guidance."
# custom:
#   entity:
#     metadata:
#       name: "codeql-warnings"
remediation contains {
	"policy": "codeql_warnings",
	"level": "optional",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
} if {
	alert := input.entity.spec.alert
	alert.rule.severity == "warning"
	alert.tool.name == "CodeQL"
}