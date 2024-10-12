import frappe
from frappe.utils import today


"""
This is an API method to check for duplicate service requests in the Sales Invoice DocType.
"""
@frappe.whitelist()
def count_duplicate_service_requests(patient, service_unit, docstatus):
    # posting_date = today()
    # Count the number of duplicate records
    duplicate_count = frappe.db.count(
        "Sales Invoice",  # DocType name
        filters={
            "patient": patient,
            "service_unit": service_unit,
            # "posting_date": posting_date,
            "docstatus": docstatus
        }
    )

    return duplicate_count


"""
This is an API method to get today's date for general usage.
"""
@frappe.whitelist()
def get_today():
    return today()


"""
This is a API method to check for duplicates in the Sales Invoice entries.
"""
@frappe.whitelist()
def check_duplicate_sales_invoice_entries(patient):
    today_date = today()

    duplicates = frappe.db.count("Sales Invoice",
                                 filters={
                                     "patient": patient,
                                     "creation_date": today_date,
                                     "docstatus": 0
                                 })
    if duplicates > 1:
        return True

