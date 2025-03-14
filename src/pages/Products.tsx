
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { ProductList } from "@/components/products/ProductList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Products = () => {
  return (
    <Layout>
      <PageHeader 
        title="Products"
        description="Manage your product catalog"
      >
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </PageHeader>
      
      <PageContent>
        <ProductList />
      </PageContent>
    </Layout>
  );
};

export default Products;
