
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Package, ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockStockSummary = {
  totalProducts: 128,
  totalStock: 3452,
  lowStock: 18,
  recentTransfers: 24,
};

const mockLocationStock = [
  { name: "Main Warehouse", stock: 2245, percentage: 65 },
  { name: "Store Alpha", stock: 425, percentage: 12 },
  { name: "Store Beta", stock: 486, percentage: 14 },
  { name: "Store Gamma", stock: 296, percentage: 9 },
];

const mockPopularProducts = [
  { name: "Premium T-Shirt", sku: "TS-PRE-M", stock: 142, trend: "up" },
  { name: "Standard Hoodie", sku: "HD-STD-L", stock: 87, trend: "up" },
  { name: "Designer Jacket", sku: "JK-DSG-S", stock: 23, trend: "down" },
  { name: "Casual Pants", sku: "PT-CSL-M", stock: 56, trend: "stable" },
];

export function StockOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StockSummaryCard />
      <LocationStockCard />
      <LowStockCard />
      <PopularProductsCard />
    </div>
  );
}

function StockSummaryCard() {
  return (
    <Card variant="default" className="col-span-1">
      <CardHeader>
        <CardTitle>Stock Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StockMetric 
            icon={<Package className="h-5 w-5 text-blue-500" />}
            label="Total Products"
            value={mockStockSummary.totalProducts}
          />
          
          <StockMetric 
            icon={<Package className="h-5 w-5 text-green-500" />}
            label="Total Items in Stock"
            value={mockStockSummary.totalStock}
          />
          
          <StockMetric 
            icon={<Package className="h-5 w-5 text-amber-500" />}
            label="Low Stock Items"
            value={mockStockSummary.lowStock}
          />
          
          <StockMetric 
            icon={<ArrowRight className="h-5 w-5 text-purple-500" />}
            label="Recent Transfers"
            value={mockStockSummary.recentTransfers}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StockMetric({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="font-medium">{value.toLocaleString()}</span>
    </div>
  );
}

function LocationStockCard() {
  return (
    <Card variant="default" className="col-span-1">
      <CardHeader>
        <CardTitle>Stock by Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockLocationStock.map((location) => (
            <div key={location.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{location.name}</span>
                <span className="text-sm text-muted-foreground">
                  {location.stock.toLocaleString()} items
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${location.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LowStockCard() {
  return (
    <Card variant="default" className="col-span-1">
      <CardHeader>
        <CardTitle>Low Stock Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 dark:bg-amber-900/20">
                <Package className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{mockStockSummary.lowStock}</p>
              <p className="text-sm text-muted-foreground">Items low on stock</p>
            </div>
          </div>
          <button className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
            View all low stock items
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function PopularProductsCard() {
  return (
    <Card variant="default" className="col-span-1">
      <CardHeader>
        <CardTitle>Popular Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPopularProducts.map((product) => (
            <div key={product.sku} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{product.stock}</span>
                {product.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                {product.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                {product.trend === "stable" && <Activity className="h-4 w-4 text-blue-500" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
