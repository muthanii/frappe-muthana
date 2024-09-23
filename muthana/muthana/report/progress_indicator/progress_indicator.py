# Copyright (c) 2024, muthanii and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
  if not filters:
    filters = {}

  # Ensure required filters are provided
  if not filters.get("patient"):
    frappe.throw("Patient filter is required")
  if not filters.get("date"):
    frappe.throw("Date filter is required")

  # SQL query to fetch data from `tabLab Test`
  data = frappe.db.sql("""
	        SELECT
	            patient,
	            date,
	            COUNT(CASE WHEN docstatus = 1 THEN 1 END) AS Submitted,
	            COUNT(CASE WHEN docstatus = 0 THEN 1 END) AS Draft,
	            CONCAT(
	                CAST(COUNT(CASE WHEN docstatus = 1 THEN 1 END) AS CHAR), ' / ',
	                CAST(COUNT(CASE WHEN docstatus = 1 THEN 1 END) + COUNT(CASE WHEN docstatus = 0 THEN 1 END) AS CHAR)
	            ) AS Progress,
	            ROUND(
	                (COUNT(CASE WHEN docstatus = 1 THEN 1 END) / 
	                NULLIF(COUNT(docstatus), 0) * 100), 0
	            ) AS Percentage
	        FROM
	            `tabLab Test`
	        WHERE
	            patient = %(patient)s
	            AND date = %(date)s
	        GROUP BY
	            patient, date
	    """, filters, as_dict=True)

  # Define columns for the report
  columns = [
    {
      "label": "Patient",
      "fieldname": "patient",
      "fieldtype": "Link",
      "options": "Patient",
      "width": 150
    },
    {
      "label": "Date",
      "fieldname": "date",
      "fieldtype": "Date",
      "width": 120
    },
    {
      "label": "Completed Tests",
      "fieldname": "Submitted",
      "fieldtype": "Int",
      "width": 130
    },
    {
      "label": "Ongoing Tests",
      "fieldname": "Draft",
      "fieldtype": "Int",
      "width": 120
    },
    {
      "label": "Progress",
      "fieldname": "Progress",
      "fieldtype": "Data",
      "width": 100
    },
    {
      "label": "Percentage",
      "fieldname": "Percentage",
      "fieldtype": "Percent",
      "width": 100
    }
  ]

  # Return columns and data for the report
  return columns, data
