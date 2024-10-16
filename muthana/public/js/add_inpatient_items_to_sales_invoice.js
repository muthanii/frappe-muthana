var globalResponse = null;

frappe.ui.form.on("Sales Invoice", {
  refresh(frm) {
    // This condition is very important
    if (!frm.doc.patient) {
      return; // Exit if patient is not selected
    }

    // Calling the server-side method
    frappe.call({
      method: 'muthana.muthana.api.get_patient_from_tabInpatientRecord',
      args: {
        patient: frm.doc.patient  // Passing the patient value here
      },
      callback: function(response) {
        if (response.message) {
          // Assign the response to the global variable
          globalResponse = response.message;
          // Extract the 'name' field from the first object in the response array
          var inpatientRecordName = response.message[0].name;
          console.log("Response Message (assigned globally):", response);
          frm.set_value('custom_inpatient_record', inpatientRecordName); // Set the 'name' of the inpatient record
          frm.refresh_field('custom_inpatient_record');

        } else {
          frappe.msgprint(__("No records found."));
        }
      },
      error: function(error) {
        frappe.msgprint(__("Error fetching inpatient records. Please check server logs."));
      }
    });

    // Add the custom button "Inpatient Items" inside the "Get Healthcare Items From".
    frm.add_custom_button(__("Inpatient Record"), function() {
      if (!globalResponse || !globalResponse[0]) {
        frappe.msgprint(__("Please select a valid Inpatient Record first."));
        return;
      }

      // Catches the custom Inpatient Record field.
      var inpatient_record_name = globalResponse[0].name;
      if (inpatient_record_name) {
        // Validation for checking the items in the Inpatient Items Child table.
        frappe.db.get_doc("Inpatient Record", inpatient_record_name).then(function(inpatient_record) {
          if (Array.isArray(inpatient_record.custom_inpatient_items) && inpatient_record.custom_inpatient_items.length > 0) {
            // Clearing the table
            frm.clear_table("items");
            // Looping through the items
            inpatient_record.custom_inpatient_items.forEach(function(item) {
              // Check if the item already exists in the "items" child table
              var exists = frm.doc.items.some(function(row) {
                return row.item_name === item.item_name;
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
          }
          //  else {
          //   frappe.msgprint(__("No items found in the selected Inpatient Record."));
          // }
        }).catch(function(error) {
          frappe.msgprint(__("Unable to fetch Inpatient Record. Please try again later."));
        });
      } else {
        frappe.msgprint(__("Please select an Inpatient Record first."));
      }
    }, __("Get Items From"));
  }
});
