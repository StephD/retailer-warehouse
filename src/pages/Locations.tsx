
import { useState } from "react";
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, MapPin, Package, ArrowRight, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for locations
const initialLocations = [
  { 
    id: 1, 
    name: "Main Warehouse", 
    type: "warehouse",
    address: "123 Industrial Park, Business District",
    totalStock: 2578,
    capacity: 5000,
    manager: "John Smith",
    contact: "+1 (555) 123-4567"
  },
  { 
    id: 2, 
    name: "Downtown Store", 
    type: "store",
    address: "456 Main Street, Downtown",
    totalStock: 382,
    capacity: 500,
    manager: "Sarah Johnson",
    contact: "+1 (555) 234-5678"
  },
  { 
    id: 3, 
    name: "Westside Mall", 
    type: "store",
    address: "789 Shopping Center Blvd, Westside",
    totalStock: 256,
    capacity: 400,
    manager: "Michael Brown",
    contact: "+1 (555) 345-6789"
  },
  { 
    id: 4, 
    name: "East End Boutique", 
    type: "store",
    address: "321 Fashion Avenue, East End",
    totalStock: 198,
    capacity: 300,
    manager: "Emily Davis",
    contact: "+1 (555) 456-7890"
  },
  { 
    id: 5, 
    name: "Secondary Storage", 
    type: "warehouse",
    address: "654 Logistics Lane, Industrial Zone",
    totalStock: 1245,
    capacity: 3000,
    manager: "Robert Wilson",
    contact: "+1 (555) 567-8901"
  }
];

const Locations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState(initialLocations);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLocation = () => {
    toast({
      title: "Feature coming soon",
      description: "Location management functionality will be available in the next update.",
    });
  };

  const calculateUsage = (stock: number, capacity: number) => {
    return Math.round((stock / capacity) * 100);
  };

  return (
    <Layout>
      <PageHeader 
        title="Locations"
        description="Manage your store and warehouse locations"
      >
        <Button onClick={handleAddLocation} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Location</span>
        </Button>
      </PageHeader>
      
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <div className="w-full max-w-sm">
            <Input
              type="search"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <div className={`h-2 w-full ${location.type === 'warehouse' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {location.type === 'warehouse' ? 
                      <Package className="h-5 w-5 text-blue-500" /> : 
                      <Store className="h-5 w-5 text-green-500" />
                    }
                    <CardTitle>{location.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{location.address}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Stock capacity usage</span>
                      <span className="font-medium">{calculateUsage(location.totalStock, location.capacity)}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          calculateUsage(location.totalStock, location.capacity) > 90 
                            ? 'bg-red-500' 
                            : calculateUsage(location.totalStock, location.capacity) > 70 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                        }`} 
                        style={{ width: `${calculateUsage(location.totalStock, location.capacity)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current Stock</div>
                      <div className="font-medium">{location.totalStock.toLocaleString()} items</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Capacity</div>
                      <div className="font-medium">{location.capacity.toLocaleString()} items</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Manager</div>
                      <div className="font-medium">{location.manager}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Contact</div>
                      <div className="font-medium">{location.contact}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContent>
    </Layout>
  );
};

export default Locations;
