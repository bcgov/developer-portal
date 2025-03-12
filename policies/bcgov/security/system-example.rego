package bcgov.security

# METADATA
# entrypoint: true
default system_example := false

system_example if {
	input.entity.kind == "system"
}
