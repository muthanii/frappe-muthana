frappe.ui.form.on('Lab Test', {
    refresh: function(frm) {
        // Ensure both patient and test template are selected
        if (frm.doc.patient && frm.doc.template) {
            frappe.db.get_list('Lab Test', {
                filters: {
                    'patient': frm.doc.patient,            // Filter by patient
                    'name': ['!=', frm.doc.name],          // Exclude the current lab test
                    'template': frm.doc.template,          // Filter by Test Template
                    'docstatus': 1                         // Only include submitted lab tests
                },
                fields: ['name'],
                order_by: 'creation desc',
                limit: 1 // Fetch only the most recent test
            }).then(previousTests => {
                // Safety Check: Ensure previousTests is defined and has at least one entry
                if (previousTests && previousTests.length > 0) {
                    const previousTestName = previousTests[0].name;

                    frappe.db.get_doc('Lab Test', previousTestName).then(previousTest => {
                        // Safety Check: Ensure previousTest and its normal_test_items exist and have entries
                        if (previousTest && previousTest.normal_test_items && previousTest.normal_test_items.length > 0) {
                            // Ensure current form's normal_test_items is initialized
                            if (!frm.doc.normal_test_items) {
                                frm.doc.normal_test_items = [];
                            }

                            // Loop through all items in the previous test and set values starting from the first row
                            previousTest.normal_test_items.forEach(function(prevItem, index) {
                                // Safety Check: Ensure prevItem and result_value exist
                                if (prevItem && prevItem.result_value != null) {
                                    // Check if the row already exists at this index, if not add a new row
                                    let currentRow = frm.doc.normal_test_items[index];
                                    if (!currentRow) {
                                        currentRow = frm.add_child('normal_test_items');
                                    }

                                    // Safety Check: Avoid overwriting existing data
                                    if (!currentRow.custom_previous_result) {
                                        // Set the values in the row (either newly added or existing)
                                        currentRow.custom_previous_result = String(prevItem.result_value) + " "; // Set previous result
                                    }
                                }
                            });

                            // Refresh the child table to show the newly updated/added rows
                            frm.refresh_field('normal_test_items');
                        } else {
                            // Handle case where no normal_test_items are found in previousTest
                            frappe.msgprint(__('No previous test items found for this patient and template.'));
                        }
                    }).catch(function(error) {
                        // Handle error in getting the previous test document
                        console.error('Error fetching previous Lab Test document:', error);
                        frappe.msgprint(__('An error occurred while fetching the previous Lab Test.'));
                    });
                } else {
                    // Handle case where no previous tests are found
                    frappe.msgprint(__('No previous Lab Tests found for this patient and template.'));
                }
            }).catch(function(error) {
                // Handle error in getting the list of previous tests
                console.error('Error fetching previous Lab Tests:', error);
                frappe.msgprint(__('An error occurred while fetching previous Lab Tests.'));
            });
        }
    }
});
