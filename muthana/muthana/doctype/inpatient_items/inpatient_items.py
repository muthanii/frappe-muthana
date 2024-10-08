# Copyright (c) 2024, muthanii and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class InpatientItems(Document):
  pass
	# def on_update(self):
		# Get access to the Sales Invoice DocType:
		# frappe.get_doc("Sales Invoice Item", "")

		# Access to the main Child Table
		# doc.item self.item_name
		# self.quantity
		# self.warehouse
		# self.is_billed pass