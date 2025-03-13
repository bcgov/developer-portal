package bcgov.security

# METADATA
# entrypoint: true
alert := {"message": "This is an alert"} if {
	input.entity.kind == "alert"
}
