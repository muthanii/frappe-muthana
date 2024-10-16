frappe.ui.form.on("Lab Test", {
  refresh: async function(frm) {
    // This function sets the Previous Result values in the database for future use in other doctypes and events.
    console.log("Previous result script triggered");

    // Extract necessary values from the form
    const patient_name = frm.doc.patient_name;
    const template = frm.doc.template;

    try {
      // Get the most recent lab test entry and then get the previous results
      const recent_lab_test_entry = await get_recent_lab_test_entry(patient_name, template);
      console.log("Then block executed with recent_lab_test_entry:", recent_lab_test_entry);
      const previous_results = await get_previous_results(recent_lab_test_entry);
      console.log("Previous results fetched:", previous_results);
      commit_previous_lab_test_entry_to_db(recent_lab_test_entry, previous_results);
    } catch (error) {
      console.error("Error:", error);
    }
  }
});

// Function to get the previous results
function get_previous_results(docname) {
  return new Promise((resolve, reject) => {
    console.log("get_previous_results() called with:", docname);
    frappe.call({
      method: "muthana.muthana.api.get_previous_results",
      args: {
        'parent': docname
      },
      callback: function(response) {
        if (response && response.message) {
          console.log("Previous results fetched successfully:", response.message);
          resolve(response.message);
        } else {
          console.error("Error fetching previous results.");
          reject("Failed to fetch previous results.");
        }
      }
    });
  });
}

// Function to get the most recent lab test entry
function get_recent_lab_test_entry(patient_name, template) {
  return new Promise((resolve, reject) => {
    frappe.call({
      method: "muthana.muthana.api.get_recent_lab_test_entry",
      args: {
        patient_name: patient_name,
        template: template
      },
      callback: function(response) {
        if (response && response.message) {
          console.log("Promise resolved with:", response.message);
          resolve(response.message);
        } else {
          console.log("Promise rejected: No response or message");
          reject("No recent lab test entry found or error occurred.");
        }
      }
    });
  });
}

// [Subject to change]
// Function to commit changes to the database
// function commit_previous_lab_test_entry_to_db(docname, values) {
//   if (Array.isArray(values)) {
//     values.forEach(value => {
//       frappe.call({
//         method: "muthana.muthana.api.add_to_db",
//         args: {
//           doctype: "Normal Test Result",
//           parent: docname,
//           field: "custom_previous_result",
//           values: values
//         },
//         callback: function() {
//           console.log(`Committed value ${value} to database for docname: ${docname}`);
//         }
//       });
//     });
//   } else {
//     frappe.call({
//       method: "muthana.muthana.api.add_to_db",
//       args: {
//         doctype: "Normal Test Result",
//         parent: docname,
//         field: "custom_previous_result",
//         value: values
//       },
//       callback: function() {
//         console.log("Committed to database.");
//       }
//     });
//   }
// }