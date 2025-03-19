
export interface Attribute {
  id: string;
  name: string;
  code: string;
  type: "text" | "number" | "select" | "boolean";
  is_required: boolean;
  is_filterable: boolean;
  is_variant: boolean;
  display_order: number;
}

export interface AttributeOption {
  id: string;
  attribute_id: string;
  value: string;
  display_order: number;
}

export interface ProductAttributeValue {
  id: string;
  product_id: string;
  attribute_id: string;
  value: string;
}
