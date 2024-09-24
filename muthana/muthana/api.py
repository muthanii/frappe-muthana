import frappe
# from frappe.utils import today

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
