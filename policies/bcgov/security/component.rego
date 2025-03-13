package bcgov.security

# METADATA
# entrypoint: true
# title: Component Example
# description: This is a component example
# custom:
#   filter:
#     - kind: alert
component := {"message": "This is a component"} if {
	input.entity.kind == "component"
}
