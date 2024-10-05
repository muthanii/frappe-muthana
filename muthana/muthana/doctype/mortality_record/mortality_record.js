// Copyright (c) 2024, muthanii and contributors
// For license information, please see license.txt

frappe.ui.form.on('Mortality Record', {
  was_the_deceased_pregnant: function(frm) {
      // Trigger the visibility toggle for specific fields when 'was_the_deceased_pregnant' changes
      toggle_pregnancy_fields(frm);
  },
  refresh: function(frm) {
      // Ensure visibility logic is applied when the form is refreshed
      toggle_pregnancy_fields(frm);
  }
});

function toggle_pregnancy_fields(frm) {
  // Determine if pregnancy-related fields should be shown based on 'was_the_deceased_pregnant'
  let show_fields = frm.doc.was_the_deceased_pregnant === 'Yes';
  toggle_field_visibility(frm, 'activity_before_death', show_fields);
  toggle_field_visibility(frm, 'number_of_weeks_pregnant', show_fields);
}

function toggle_field_visibility(frm, fieldname, condition) {
  // Utility function to set the visibility of a field based on the condition
  set_field_visibility(frm, fieldname, condition);
}

function set_field_visibility(frm, fieldname, condition) {
  // Set the visibility of a field based on the condition
  // If 'condition' is true, the field will be visible (hidden = 0), otherwise it will be hidden (hidden = 1)
  let is_field_hidden = condition ? 0 : 1;
  frm.set_df_property(fieldname, 'hidden', is_field_hidden);
}