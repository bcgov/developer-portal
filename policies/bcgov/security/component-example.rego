package bcgov.security

# METADATA
# entrypoint: true
default component_example := false

component_example if {
	input.entity.kind == "component"
}
