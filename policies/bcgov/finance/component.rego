package bcgov.finance

import data.bcgov.security

# METADATA
# entrypoint: true
# title: Component Example in Finance Portal
# description: This is a component example
# custom:
#   filter:
#     - kind: alert
component := {"message": "This is a component in finance portal"} if {
	security.component
	input.entity.relations.partOf == "system:default/finance-portal"
}
