frappe.ui.form.on("Sales Invoice", {
  refresh(frm) {
    // Addes the custom button "Inpatient Items" inside the "Get Healthcare Items From".
    frm.add_custom_button(__("Inpatient Items"), function() {
      // Catches the custom Inpatient Record field.
      var inpatient_record_name = frm.doc.custom_inpatient_record;
      // If it's catched and available before clicking the button, do the following:
      // 1. Go to the Inpatient Record DocType with the same name from variable above.
      // 2. Check if the items in the Inpatient Items Child table exists.
      // 3. If available, loop through the items and set them in the "items" field in the Sales Invoice.
      if (inpatient_record_name) {
        // Validation for checking the items in the Inpatient Items Child table.
        frappe.db.get_doc("Inpatient Record", inpatient_record_name).then(function(inpatient_record) {
          if (Array.isArray(inpatient_record.custom_inpatient_items) && inpatient_record.custom_inpatient_items.length > 0) {
            // Looping through the items
            inpatient_record.custom_inpatient_items.forEach(function(item) {
              // Check if the item already exists in the "items" child table
              var exists = frm.doc.items.some(function(row) {
                return row.item_code === item.item_code; // Use item_code for better reliability
              });

              if (!exists) {
                // If item does not exist, add a new row
                let new_row = frm.add_child("items");
                new_row.item_name = item.item_name;
                new_row.qty = item.quantity;
                new_row.warehouse = item.warehouse;
              }
            });
            // Refresh the field to see the updated child table
            frm.refresh_field("items");
          } else {
            frappe.msgprint(__("No items found in the selected Inpatient Record."));
          }
        }).catch(function(error) {
          frappe.msgprint(__("Unable to fetch Inpatient Record. Error: ") + error.message);
        });
      } else {
        frappe.msgprint(__("Please select an Inpatient Record first."));
      }
    }, __("Get Items From"));
  }
});
