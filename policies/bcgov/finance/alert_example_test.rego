package bcgov.finance_test

test_alert_match if {
	finance.alert_example with input as {"entity": {"kind": "alert"}}
}

test_alert_no_match if {
	not finance.alert_example with input as {"entity": {"kind": "component"}}
}
