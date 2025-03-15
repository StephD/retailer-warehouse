import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductForm } from "@/components/products/ProductForm";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  supplier: string | null;
  in_stock?: number;
};

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
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  Error loading products. Please try again.
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="font-medium">
                    <div>
                      {product.name}
                      {product.supplier && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {product.supplier}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">${Number(product.cost).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      product.in_stock < 30 ? "text-red-500" : 
                      product.in_stock < 50 ? "text-amber-500" : "text-green-500"
                    )}>
                      {product.in_stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => toast.info(`Edit ${product.name}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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
