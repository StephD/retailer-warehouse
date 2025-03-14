
import { useState } from "react";
import { 
  ArrowRight, 
  ArrowDown, 
  Package, 
  Store, 
  PlusCircle, 
  Search, 
  TrashIcon, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data
const mockLocations = [
  { id: "warehouse", name: "Main Warehouse", type: "warehouse" },
  { id: "store-1", name: "Store Alpha", type: "store" },
  { id: "store-2", name: "Store Beta", type: "store" },
  { id: "store-3", name: "Store Gamma", type: "store" },
];

const mockProducts = [
  { id: "1", name: "Premium T-Shirt", sku: "TS-PRE-M", available: 142 },
  { id: "2", name: "Standard Hoodie", sku: "HD-STD-L", available: 87 },
  { id: "3", name: "Designer Jacket", sku: "JK-DSG-S", available: 23 },
  { id: "4", name: "Casual Pants", sku: "PT-CSL-M", available: 56 },
  { id: "5", name: "Athletic Socks", sku: "SK-ATH-U", available: 210 },
];

interface TransferItem {
  productId: string;
  quantity: number;
}

export function TransferForm() {
  const isMobile = useIsMobile();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [transferItems, setTransferItems] = useState<TransferItem[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate total items
  const totalItems = transferItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Get products for the selected location
  const availableProducts = mockProducts.filter(product => 
    !transferItems.some(item => item.productId === product.id)
  );
  
  // Filter products by search term
  const filteredProducts = availableProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handlers
  const handleAddItem = (productId: string) => {
    const newItem: TransferItem = {
      productId,
      quantity: 1
    };
    setTransferItems([...transferItems, newItem]);
    setIsAddingProduct(false);
    setSearchTerm("");
  };
  
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newItems = [...transferItems];
    newItems[index].quantity = quantity;
    setTransferItems(newItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...transferItems];
    newItems.splice(index, 1);
    setTransferItems(newItems);
  };
  
  const handleCreateTransfer = () => {
    // Validation
    if (!fromLocation) {
      toast.error("Please select a source location");
      return;
    }
    
    if (!toLocation) {
      toast.error("Please select a destination location");
      return;
    }
    
    if (fromLocation === toLocation) {
      toast.error("Source and destination cannot be the same");
      return;
    }
    
    if (transferItems.length === 0) {
      toast.error("Please add at least one product to transfer");
      return;
    }
    
    // Create transfer logic would go here
    toast.success("Transfer created successfully!");
    
    // Show packing list
    setTimeout(() => {
      toast("Packing list generated", {
        description: "The packing list is ready for printing",
        action: {
          label: "View",
          onClick: () => console.log("View packing list"),
        },
      });
    }, 1000);
    
    // Reset form
    setFromLocation("");
    setToLocation("");
    setTransferItems([]);
  };
  
  // Helper to find product by ID
  const getProductById = (id: string) => mockProducts.find(p => p.id === id);
  
  return (
    <div className="animate-fade-in">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Create Stock Transfer</CardTitle>
          <CardDescription>
            Move inventory between warehouse and stores
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Location</label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        {location.type === "warehouse" ? (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Store className="h-4 w-4 text-muted-foreground" />
                        )}
                        {location.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To Location</label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        {location.type === "warehouse" ? (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Store className="h-4 w-4 text-muted-foreground" />
                        )}
                        {location.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Location Flow Indicator */}
          {fromLocation && toLocation && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{mockLocations.find(l => l.id === fromLocation)?.name}</span>
                
                {isMobile ? (
                  <ArrowDown className="h-4 w-4 text-primary" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-primary" />
                )}
                
                <span>{mockLocations.find(l => l.id === toLocation)?.name}</span>
              </div>
            </div>
          )}
          
          {/* Products List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Transfer Items</h3>
              
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Product</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product to Transfer</DialogTitle>
                    <DialogDescription>
                      Select products to include in this transfer.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 my-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto border rounded-md">
                      {filteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No products available
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredProducts.map(product => (
                            <div 
                              key={product.id}
                              className="p-3 hover:bg-accent cursor-pointer transition-colors flex items-center justify-between"
                              onClick={() => handleAddItem(product.id)}
                            >
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground">{product.sku}</div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Available: {product.available}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {transferItems.length === 0 ? (
              <div className="border rounded-md p-8 text-center">
                <div className="flex justify-center mb-3">
                  <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-muted-foreground mb-4">No products added to this transfer yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingProduct(true)}
                  className="gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {transferItems.map((item, index) => {
                      const product = getProductById(item.productId);
                      return (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">
                              {product?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {product?.sku}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Input
                              type="number"
                              min="1"
                              max={product?.available || 999}
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-24 inline-block text-right"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t p-6">
          <div className="text-sm">
            <span className="text-muted-foreground">Total Items:</span>{" "}
            <span className="font-medium">{totalItems}</span>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              Cancel
            </Button>
            
            <Button 
              disabled={transferItems.length === 0 || !fromLocation || !toLocation}
              onClick={handleCreateTransfer}
              className="gap-2"
            >
              <span>Create Transfer</span>
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
