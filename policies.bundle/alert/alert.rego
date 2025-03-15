# METADATA
# entrypoint: true
package alert

import data.alert.remediation

import rego.v1

codeql_warnings(alert) := {
	"policy": "codeql_warnings",
	"level": "optional",
	"help": alert.rule.help,
	"description": alert.rule.full_description,
}
