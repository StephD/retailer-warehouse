
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

// Function to fetch products from Supabase
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  
  // Fetch inventory totals for each product
  const productsWithStock = await Promise.all(
    data.map(async (product) => {
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', product.id);
      
      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError);
        return { ...product, in_stock: 0 };
      }
      
      const totalStock = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
      return { ...product, in_stock: totalStock };
    })
  );
  
  return productsWithStock;
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
  
  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FilterButton />
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
