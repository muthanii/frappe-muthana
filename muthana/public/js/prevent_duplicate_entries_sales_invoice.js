frappe.ui.form.on("Sales Invoice", {
  validate: function(frm) {
    // Catch the variables to check for duplication:
    // 1. Patient Name
    // 2. Today's Date from the duplication checking function

    // Catching the Patient Name
    const patient_name = frm.doc.patient_name;

    // Getting today's date and checking for duplication
    frappe.call({
      method: "muthana.muthana.api.check_duplicate_sales_invoice_entries",
      args: {
        'patient': patient_name
      },
      callback: function(r) {
        if (r) {
          frappe.msgprint("Duplicates found!");
          frappe.validated = false;
        }
      }
    });
  }
});
