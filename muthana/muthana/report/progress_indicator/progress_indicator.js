// Copyright (c) 2024, muthanii and contributors
// For license information, please see license.txt

frappe.query_reports["Progress Indicator"] = {
  "filters": [
    {
      "fieldname": "patient",
      "label": __("Patient"),
      "fieldtype": "Link",
      "options": "Patient",
      "reqd": 1,
    },
    {
      "fieldname": "date",
      "label": __("Date"),
      "fieldtype": "Date",
      "reqd": 1,
    }
  ]
};
