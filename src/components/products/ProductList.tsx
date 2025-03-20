
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "./ProductForm";
import { SearchBar } from "./SearchBar";
import { FilterButton } from "./FilterButton";
import { ProductsTable } from "./ProductsTable";
import { Product } from "./ProductRow";
import { Attribute } from "@/types/attributes";

// Function to fetch products from Supabase
const fetchProducts = async (): Promise<Product[]> => {
  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  
  // Use direct RPC calls to avoid TypeScript errors for tables not in types
  const { data: attributes, error: attributesError } = await supabase.rpc('get_attributes');
  
  if (attributesError) {
    console.error('Error fetching attributes:', attributesError);
  }
  
  // Fetch product attribute values
  const { data: attributeValues, error: valuesError } = await supabase.rpc('get_attribute_values');
    
  if (valuesError) {
    console.error('Error fetching attribute values:', valuesError);
  }
  
  // Fetch inventory totals for each product
  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      // Get inventory data
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', product.id);
      
      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError);
        return { ...product, in_stock: 0 };
      }
      
      const totalStock = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
      
      // Process attribute values for this product
      const productAttributeValues = attributeValues
        ? attributeValues.filter((val: any) => val.product_id === product.id)
        : [];
      
      // Create attribute map
      const attributesMap: Record<string, string> = {};
      
      if (attributes && productAttributeValues.length > 0) {
        productAttributeValues.forEach((attrValue: any) => {
          const attribute = attributes.find((attr: any) => attr.id === attrValue.attribute_id);
          if (attribute) {
            attributesMap[attribute.name] = attrValue.value;
          }
        });
      }
      
      return { 
        ...product, 
        in_stock: totalStock,
        attributes: attributesMap 
      };
    })
  );
  
  return productsWithDetails;
};

// Function to delete a product
const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
  
  return id;
};

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch products with React Query
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    }
  });
  
  // Extract unique categories from products
  const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
  
  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };
  
  // Filter toggle handler
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
  };
  
  // Filter products based on search term and selected categories
  const filteredProducts = products.filter(product => {
    // Text search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FilterButton 
            categories={uniqueCategories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
      
      <ProductsTable 
        products={filteredProducts}
        isLoading={isLoading}
        isError={isError}
        onDeleteProduct={handleDeleteProduct}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product in your catalog.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
