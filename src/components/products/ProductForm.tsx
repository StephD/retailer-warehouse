
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Attribute } from "@/types/attributes";
import { AttributeField } from "./AttributeField";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  sku: z.string().min(2, { message: "SKU must be at least 2 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  cost: z.coerce.number().positive({ message: "Cost must be positive" }),
  supplier: z.string().optional(),
  attributes: z.record(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({});
  
  // Fetch attributes
  const { data: attributes = [], isLoading: attributesLoading } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attributes')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching attributes:', error);
        return [];
      }
      
      // Type assertion for correct typing
      return (data || []) as Attribute[];
    }
  });
  
  // Define the form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      cost: 0,
      supplier: "",
      attributes: {},
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      // Ensure all required fields are present - transform undefined values to empty strings
      const productData = {
        name: values.name,
        sku: values.sku,
        category: values.category,
        price: values.price,
        cost: values.cost,
        supplier: values.supplier || null, // Convert empty string to null if needed
      };
      
      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
      
      if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
      }
      
      const productId = data[0].id;
      
      // Insert product attribute values
      if (Object.keys(attributeValues).length > 0) {
        // Create an array of attribute value objects
        const attributeValuesData = Object.entries(attributeValues).map(([attributeId, value]) => ({
          product_id: productId,
          attribute_id: attributeId,
          value,
        }));
        
        // Using raw RPC call instead of the typed interface to avoid TypeScript errors
        const { error: attrError } = await supabase.rpc('insert_attribute_values', {
          values: attributeValuesData
        });
        
        if (attrError) {
          console.error('Error saving attribute values:', attrError);
          // Product is already created, so don't throw here
        }
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      form.reset();
      setAttributeValues({});
      toast.success("Product created successfully");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Failed to create product");
    }
  });

  const onSubmit = (values: ProductFormValues) => {
    createProductMutation.mutate(values);
  };

  const handleAttributeChange = (attributeId: string, value: string) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Premium T-Shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="TS-PRE-L" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Apparel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="29.99" 
                    step="0.01" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="12.50" 
                    step="0.01" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Supplier (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Fashion Suppliers Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {attributes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Product Attributes</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {attributes.map(attribute => (
                <AttributeField
                  key={attribute.id}
                  attribute={attribute}
                  value={attributeValues[attribute.id] || ''}
                  onChange={(value) => handleAttributeChange(attribute.id, value)}
                  control={form.control}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
