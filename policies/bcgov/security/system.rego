package bcgov.security

# METADATA
# entrypoint: true
system := {"message": "This is a system"} if {
	input.entity.kind == "system"
}
