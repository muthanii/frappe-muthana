frappe.ui.form.on('Sales Invoice', {
  before_save: function(frm) {
      // Extract patient and service_unit values from the form
      let patient = frm.doc.patient;
      let service_unit = frm.doc.service_unit;
      let docstatus = frm.doc.docstatus;

      // Check for duplicates using the server-side method
      frappe.call({
        method: "muthana.muthana.api.count_duplicate_service_requests",
        args: {
            patient: patient,
            service_unit: service_unit,
            docstatus: docstatus
        },
        callback: function(response) {
            if (response.message > 0) {
                frappe.msgprint(__('There are ' + response.message + ' duplicate service requests for this patient.'));
                frappe.validated = false;
            }
        }
    });    
  }
});
