frappe.ui.form.on("Sales Invoice", {
  refresh(frm) {
    frm.add_custom_button(__("Inpatient Record"), function() {
      // Get the value of the link first
      var inpatient_record_name = frm.doc.custom_inpatient_record;
      if (inpatient_record_name) {
        // Get the values of the child table field according to the link
        frappe.db.get_doc("Inpatient Record", inpatient_record_name).then(function(inpatient_record) {
          if (Array.isArray(inpatient_record.custom_inpatient_items) && inpatient_record.custom_inpatient_items.length > 0) {
            // Now loop through the items and add the child from the Inpatient Items to the Items
            inpatient_record.custom_inpatient_items.forEach(function(item) {
              let new_row = frm.add_child("items");
              new_row.item_name = item.item_name;
              new_row.qty = item.quantity;
              new_row.warehouse = item.warehouse; // Add any additional fields as needed
            });

            // Refresh the field to see the updated child table
            frm.refresh_field("items");
          } else {
            frappe.msgprint(__("No items found in the selected Inpatient Record."));
          }
        }).catch(function(error) {
          frappe.msgprint(__("Unable to fetch Inpatient Record. Please try again later."));
        });
      } else {
        frappe.msgprint(__("Please select an Inpatient Record first."));
      }
    }, __("Get Items From"));
  },

  validate(frm) {
    // Add your validation logic here if needed
  }
});
