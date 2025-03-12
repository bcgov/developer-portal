package bcgov.security

# METADATA
# entrypoint: true
default alert_example := false

alert_example if {
	input.entity.kind == "alert"
}
