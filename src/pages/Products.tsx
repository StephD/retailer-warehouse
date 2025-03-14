
import { useState } from "react";
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { ProductList } from "@/components/products/ProductList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type NewProduct = {
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  supplier: string;
};

const defaultNewProduct: NewProduct = {
  name: "",
  sku: "",
  category: "",
  price: 0,
  cost: 0,
  supplier: "",
};

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>(defaultNewProduct);
  const queryClient = useQueryClient();

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (product: NewProduct) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNewProduct(defaultNewProduct);
      setIsDialogOpen(false);
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("Failed to create product");
    }
  });

  const handleCreateProduct = () => {
    // Simple validation
    if (!newProduct.name || !newProduct.sku || !newProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    createProductMutation.mutate(newProduct);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewProduct
  ) => {
    const value = field === 'price' || field === 'cost' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value;
    
    setNewProduct({ ...newProduct, [field]: value });
  };

  return (
    <Layout>
      <PageHeader 
        title="Products"
        description="Manage your product catalog"
      >
        <Button className="gap-1" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </PageHeader>
      
      <PageContent>
        <ProductList />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product in your catalog.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    value={newProduct.name} 
                    onChange={(e) => handleInputChange(e, 'name')} 
                    placeholder="Premium T-Shirt"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input 
                    id="sku" 
                    value={newProduct.sku} 
                    onChange={(e) => handleInputChange(e, 'sku')} 
                    placeholder="TS-PRE-L"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={newProduct.category} 
                    onChange={(e) => handleInputChange(e, 'category')} 
                    placeholder="Apparel"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={newProduct.price || ''} 
                    onChange={(e) => handleInputChange(e, 'price')} 
                    placeholder="29.99"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    value={newProduct.cost || ''} 
                    onChange={(e) => handleInputChange(e, 'cost')} 
                    placeholder="12.50"
                    step="0.01"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input 
                    id="supplier" 
                    value={newProduct.supplier} 
                    onChange={(e) => handleInputChange(e, 'supplier')} 
                    placeholder="Fashion Suppliers Inc."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProduct}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageContent>
    </Layout>
  );
};

export default Products;
