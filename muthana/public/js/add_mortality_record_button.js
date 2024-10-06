frappe.ui.form.on('Inpatient Record', {
  refresh: function(frm) {
    frm.add_custom_button(__('Make Mortality Record'), function() {
        // Redirect to new Mortality Record and map fields
        frappe.new_doc('Mortality Record', {
            'deceased_patient': frm.doc.patient,
            'service_unit': frm.doc.addmission_service_unit_type
        }).then(function(doc) {
            frappe.set_route('Form', 'Mortality Record', doc.name);
        });
    }, __('Create'));
  }
});
