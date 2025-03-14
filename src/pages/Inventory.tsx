
import { useState } from "react";
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Download, ArrowLeftRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data
const mockLocations = [
  { id: "all", name: "All Locations" },
  { id: "warehouse", name: "Main Warehouse" },
  { id: "store-1", name: "Store Alpha" },
  { id: "store-2", name: "Store Beta" },
  { id: "store-3", name: "Store Gamma" },
];

const mockStockItems = [
  { 
    id: "1",
    product: "Premium T-Shirt",
    sku: "TS-PRE-M",
    warehouse: 120,
    "store-1": 12,
    "store-2": 8,
    "store-3": 2,
    lowStock: false,
    totalValue: 1800.00,
  },
  { 
    id: "2",
    product: "Standard Hoodie",
    sku: "HD-STD-L",
    warehouse: 60,
    "store-1": 10,
    "store-2": 15,
    "store-3": 2,
    lowStock: false,
    totalValue: 2225.00,
  },
  { 
    id: "3",
    product: "Designer Jacket",
    sku: "JK-DSG-S",
    warehouse: 10,
    "store-1": 8,
    "store-2": 3,
    "store-3": 2,
    lowStock: true,
    totalValue: 3055.00,
  },
  { 
    id: "4",
    product: "Casual Pants",
    sku: "PT-CSL-M",
    warehouse: 35,
    "store-1": 8,
    "store-2": 10,
    "store-3": 3,
    lowStock: false,
    totalValue: 2250.00,
  },
  { 
    id: "5",
    product: "Athletic Socks",
    sku: "SK-ATH-U",
    warehouse: 180,
    "store-1": 12,
    "store-2": 14,
    "store-3": 4,
    lowStock: false,
    totalValue: 2100.00,
  },
];

const getLocationTotal = (location: string): number => {
  return mockStockItems.reduce((total, item) => {
    if (location === "all") {
      return total + item.warehouse + item["store-1"] + item["store-2"] + item["store-3"];
    }
    return total + item[location as keyof typeof item] as number;
  }, 0);
};

const getStockValue = (location: string): number => {
  if (location === "all") {
    return mockStockItems.reduce((total, item) => total + item.totalValue, 0);
  }
  
  // This is simplified - in a real app, you'd have the value per location
  return mockStockItems.reduce((total, item) => total + (item.totalValue / 2), 0);
};

const Inventory = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter items based on search
  const filteredItems = mockStockItems.filter((item) => {
    return item.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <Layout>
      <PageHeader 
        title="Inventory"
        description="View and manage stock across all locations"
      >
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="gap-1">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transfer Stock</span>
          </Button>
        </div>
      </PageHeader>
      
      <PageContent>
        <div className="space-y-8 animate-fade-in">
          {/* Stock Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {getLocationTotal(selectedLocation)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedLocation === "all" 
                    ? "Across all locations" 
                    : `In ${mockLocations.find(l => l.id === selectedLocation)?.name}`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inventory Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${getStockValue(selectedLocation).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on product cost prices
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">
                  {mockStockItems.filter(item => item.lowStock).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items below minimum threshold
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Stock Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Stock Levels</CardTitle>
                  <CardDescription>
                    Current inventory across all locations
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      {selectedLocation === "all" && (
                        <>
                          <TableHead className="text-right">Warehouse</TableHead>
                          <TableHead className="text-right">Store Alpha</TableHead>
                          <TableHead className="text-right">Store Beta</TableHead>
                          <TableHead className="text-right">Store Gamma</TableHead>
                        </>
                      )}
                      {selectedLocation !== "all" && (
                        <TableHead className="text-right">Quantity</TableHead>
                      )}
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={selectedLocation === "all" ? 9 : 6} 
                          className="h-24 text-center"
                        >
                          No stock items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          
                          {selectedLocation === "all" && (
                            <>
                              <TableCell className="text-right">{item.warehouse}</TableCell>
                              <TableCell className="text-right">{item["store-1"]}</TableCell>
                              <TableCell className="text-right">{item["store-2"]}</TableCell>
                              <TableCell className="text-right">{item["store-3"]}</TableCell>
                            </>
                          )}
                          
                          {selectedLocation !== "all" && (
                            <TableCell className="text-right">
                              {item[selectedLocation as keyof typeof item] as number}
                            </TableCell>
                          )}
                          
                          <TableCell className="text-right font-medium">
                            {selectedLocation === "all" 
                              ? item.warehouse + item["store-1"] + item["store-2"] + item["store-3"] 
                              : item[selectedLocation as keyof typeof item] as number}
                          </TableCell>
                          
                          <TableCell className="text-right">
                            ${item.totalValue.toLocaleString()}
                          </TableCell>
                          
                          <TableCell className="text-right">
                            {item.lowStock ? (
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>Low Stock</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                In Stock
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </Layout>
  );
};

export default Inventory;
