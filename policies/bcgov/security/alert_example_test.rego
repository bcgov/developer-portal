package bcgov.security_test

import data.bcgov.security

test_alert_match if {
	security.alert_example with input as {"entity": {"kind": "alert"}}
}

test_alert_no_match if {
	not security.alert_example with input as {"entity": {"kind": "component"}}
}
