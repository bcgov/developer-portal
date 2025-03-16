package helpers

# Helper function to calculate status
calc_status(x) := "pass" if x == 0

else := "fail"

# Helper function to calculate entity reference
entity_ref(kind, namespace, name) := lower(sprintf("%v:%v/%v", [kind, namespace, name]))

entity_ref_from_entity(entity) := entity_ref(entity.kind, entity.metadata.namespace, entity.metadata.name)
