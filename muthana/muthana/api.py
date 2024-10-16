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


"""
This is a API method to for get patient from tabInpatient Record
"""
@frappe.whitelist()
def get_patient_from_tabInpatientRecord(patient):
    # Query using Frappe ORM
    records = frappe.get_all('Inpatient Record', 
                             filters={
                                 'patient': patient,
                                 'status': ['!=', 'Cancelled']
                             }, 
                             fields=['name'])  # Fetch all fields or specify the needed ones
    return records


"""
This is an API that updates records in the database. It takes a few arguments:
1. DocType
2. Docname
3. Field
4. Value
"""
# [Subject to change]
# @frappe.whitelist()
# def add_to_db(doctype, docname, field, values):
#     # If values is a list, perform bulk update
#     if isinstance(values, list):
#         for idx, value in enumerate(values):
#             frappe.db.set_value(doctype, f"{docname}-{idx}", field, value)
#         frappe.db.commit()
#     else:
#         # Add a commit to ensure changes are saved to the database for single value
#         frappe.db.set_value(doctype, docname, field, values)
#         frappe.db.commit()


"""
This is a API that gets the previous results in a clear and concise way (hopefully) given the patient and his Lab Test template. 
"""
@frappe.whitelist()
def get_previous_results(parent):
    # Fetch multiple values using get_all and order by `idx` in ascending order
    results = frappe.get_all(
        "Normal Test Result", 
        filters={'parent': parent}, 
        fields=['result_value'],
        order_by='idx ASC'  # Order by idx in ascending order
    )

    # Extract result values from the list of dictionaries
    return [result['result_value'] for result in results]


"""
This API gets the most recent last lab test entry of a patient and is feeded to get_previous_results().
"""
@frappe.whitelist()
def get_recent_lab_test_entry(patient_name, template):
    # Fetch the most recent two lab test entries ordered by creation date in descending order
    entries = frappe.get_all(
        "Lab Test",
        filters={
            "patient": patient_name,
            "template": template
        },
        fields=["name"],
        order_by="creation DESC",
        limit=2
    )

    # Return the second most recent entry if it exists
    if len(entries) > 1:
        return entries[1]['name']
    else:
        return None
