
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
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

// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "Premium T-Shirt",
    sku: "TS-PRE-M",
    category: "Apparel",
    price: 29.99,
    cost: 12.50,
    inStock: 142,
    supplier: "Fashion Suppliers Inc.",
    variants: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Standard Hoodie",
    sku: "HD-STD-L",
    category: "Apparel",
    price: 49.99,
    cost: 22.75,
    inStock: 87,
    supplier: "Fashion Suppliers Inc.",
    variants: ["M", "L", "XL"],
  },
  {
    id: "3",
    name: "Designer Jacket",
    sku: "JK-DSG-S",
    category: "Outerwear",
    price: 129.99,
    cost: 65.30,
    inStock: 23,
    supplier: "Premium Clothiers Ltd.",
    variants: ["S", "M", "L"],
  },
  {
    id: "4",
    name: "Casual Pants",
    sku: "PT-CSL-M",
    category: "Apparel",
    price: 39.99,
    cost: 18.25,
    inStock: 56,
    supplier: "Fashion Suppliers Inc.",
    variants: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "5",
    name: "Athletic Socks",
    sku: "SK-ATH-U",
    category: "Accessories",
    price: 9.99,
    cost: 3.75,
    inStock: 210,
    supplier: "Sports Gear Co.",
    variants: ["One Size"],
  },
];

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(mockProducts);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Product deleted successfully");
  };
  
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
          
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
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
            {filteredProducts.length === 0 ? (
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
                      <div className="text-xs text-muted-foreground mt-1">
                        {product.supplier}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${product.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      product.inStock < 30 ? "text-red-500" : 
                      product.inStock < 50 ? "text-amber-500" : "text-green-500"
                    )}>
                      {product.inStock}
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
    </div>
  );
}
