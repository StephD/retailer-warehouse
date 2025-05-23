
# Technical Details

## Database Schema

### Retailers (Multi-tenant)
- id (UUID)
- name (text)
- subscription_plan (text)
- currency (text)
- created_at (timestamp)

### Users
- id (UUID)
- retailer_id (UUID, references retailers.id)
- auth_id (UUID)
- email (text)
- name (text)
- role (text)
- created_at (timestamp)
- updated_at (timestamp)

### Attributes (Dynamic product attributes)
- id (UUID)
- retailer_id (UUID, references retailers.id)
- name (text)
- code (text)
- type (text)
- is_required (boolean)
- is_filterable (boolean)
- is_variant (boolean)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

### Attribute Options
- id (UUID)
- attribute_id (UUID, references attributes.id)
- value (text)
- display_order (integer)
- created_at (timestamp)

### Products
- id (UUID)
- retailer_id (UUID, references retailers.id)
- name (text)
- sku (text)
- base_price (numeric)
- cost (numeric)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### Product Attribute Values
- id (UUID)
- product_id (UUID, references products.id)
- attribute_id (UUID, references attributes.id)
- value (text)
- created_at (timestamp)
- updated_at (timestamp)

### Product Variants
- id (UUID)
- parent_product_id (UUID, references products.id)
- sku (text)
- additional_price (numeric)
- created_at (timestamp)
- updated_at (timestamp)

### Variant Attribute Values
- id (UUID)
- variant_id (UUID, references product_variants.id)
- attribute_id (UUID, references attributes.id)
- value (text)
- created_at (timestamp)
- updated_at (timestamp)

### Locations
- id (UUID)
- retailer_id (UUID, references retailers.id)
- name (text)
- type (text)
- address (text)
- contact_name (text)
- contact_email (text)
- contact_phone (text)
- is_active (boolean)
- commission_rate (numeric)
- created_at (timestamp)
- updated_at (timestamp)

### Inventory
- id (UUID)
- retailer_id (UUID, references retailers.id)
- location_id (UUID, references locations.id)
- variant_id (UUID, references product_variants.id)
- quantity (integer)
- last_updated (timestamp)
- updated_by (UUID, references users.id)

### Transfers
- id (UUID)
- retailer_id (UUID, references retailers.id)
- source_location_id (UUID, references locations.id)
- destination_location_id (UUID, references locations.id)
- status (text)
- created_by (UUID, references users.id)
- validated_by (UUID, references users.id)
- creation_date (timestamp)
- sent_date (timestamp)
- received_date (timestamp)
- notes (text)

### Transfer Items
- id (UUID)
- transfer_id (UUID, references transfers.id)
- variant_id (UUID, references product_variants.id)
- quantity (integer)
- received_quantity (integer)

### Sales Reports
- id (UUID)
- retailer_id (UUID, references retailers.id)
- location_id (UUID, references locations.id)
- month (integer)
- year (integer)
- status (text)
- created_by (UUID, references users.id)
- validated_by (UUID, references users.id)
- created_at (timestamp)
- updated_at (timestamp)

### Sales Report Items
- id (UUID)
- sales_report_id (UUID, references sales_reports.id)
- variant_id (UUID, references product_variants.id)
- quantity_sold (integer)
- selling_price (numeric)

### Audit Logs
- id (UUID)
- retailer_id (UUID, references retailers.id)
- user_id (UUID, references users.id)
- action (text)
- table_name (text)
- record_id (UUID)
- old_values (jsonb)
- new_values (jsonb)
- created_at (timestamp)

## Security Features

- Row Level Security (RLS) policies ensuring data isolation between tenants
- Role-based access control with three permission levels:
  - Standard users: View and transfer stock
  - Admin users: Modify stock and validate transfers
  - Super admin users: Full system access with inventory correction abilities
- Complete audit logging of all changes
