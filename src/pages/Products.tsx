
import { useState } from "react";
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { ProductList } from "@/components/products/ProductList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductForm } from "@/components/products/ProductForm";

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      </PageContent>
    </Layout>
  );
};

export default Products;
