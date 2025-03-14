
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Simulated inventory data
const mockInventoryData = [
  { id: 1, name: "T-Shirt Basic", sku: "TS-001", inStock: 120, location: "Warehouse" },
  { id: 2, name: "Denim Jeans", sku: "DJ-002", inStock: 75, location: "Warehouse" },
  { id: 3, name: "Hoodie Black", sku: "HB-003", inStock: 50, location: "Store 1" },
  { id: 4, name: "Summer Dress", sku: "SD-004", inStock: 35, location: "Store 2" },
  { id: 5, name: "Leather Jacket", sku: "LJ-005", inStock: 15, location: "Warehouse" },
  { id: 6, name: "Running Shoes", sku: "RS-006", inStock: 60, location: "Store 1" },
  { id: 7, name: "Winter Coat", sku: "WC-007", inStock: 40, location: "Store 3" },
  { id: 8, name: "Silk Scarf", sku: "SS-008", inStock: 90, location: "Warehouse" },
  { id: 9, name: "Cotton Socks", sku: "CS-009", inStock: 200, location: "Warehouse" },
  { id: 10, name: "Designer Bag", sku: "DB-010", inStock: 10, location: "Store 2" },
];

// Mock function to fetch inventory data
const fetchInventoryData = async () => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockInventoryData;
};

// Inventory summary for chart
const getInventorySummaryByLocation = (data: typeof mockInventoryData) => {
  const summary = data.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = { location: item.location, count: 0, totalItems: 0 };
    }
    acc[item.location].count += 1; // Count unique products
    acc[item.location].totalItems += item.inStock; // Count total inventory items
    return acc;
  }, {} as Record<string, { location: string; count: number; totalItems: number }>);
  
  return Object.values(summary);
};

const Inventory = () => {
  const { toast } = useToast();
  
  // Use React Query to fetch inventory data
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventoryData,
  });
  
  // If there's an error, show a toast notification
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load inventory data. Please try again.",
      variant: "destructive",
    });
  }
  
  // Prepare data for the chart if inventory data is loaded
  const inventorySummary = inventoryData ? getInventorySummaryByLocation(inventoryData) : [];
  
  return (
    <Layout>
      <PageHeader 
        title="Inventory" 
        description="Monitor and manage your stock levels across all locations"
      />
      
      <PageContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              {isLoading ? (
                <Skeleton className="h-16 w-16 rounded-full" />
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {inventoryData?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Unique SKUs</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>In Stock</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              {isLoading ? (
                <Skeleton className="h-16 w-16 rounded-full" />
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {inventoryData?.reduce((sum, item) => sum + Number(item.inStock), 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Total units</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              {isLoading ? (
                <Skeleton className="h-16 w-16 rounded-full" />
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {new Set(inventoryData?.map(item => item.location)).size || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Storage locations</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Inventory by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventorySummary}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalItems" name="Total Items" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Layout>
  );
};

export default Inventory;
