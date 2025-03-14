
import { Button } from "@/components/ui/button";
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { StockOverview } from "@/components/dashboard/StockOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Package, Store, TrendingUp } from "lucide-react";

// Mock data
const mockRecentActivity = [
  { 
    id: "a1", 
    type: "transfer", 
    description: "Transfer from Main Warehouse to Store Alpha", 
    items: 28, 
    status: "completed", 
    timestamp: "2 hours ago", 
    user: "John Smith" 
  },
  { 
    id: "a2", 
    type: "restock", 
    description: "New stock received at Main Warehouse", 
    items: 156, 
    status: "completed", 
    timestamp: "5 hours ago", 
    user: "Jane Doe" 
  },
  { 
    id: "a3", 
    type: "transfer", 
    description: "Transfer from Store Beta to Main Warehouse", 
    items: 12, 
    status: "in-progress", 
    timestamp: "Yesterday", 
    user: "Mike Johnson" 
  },
  { 
    id: "a4", 
    type: "stock-check", 
    description: "Inventory verification at Store Gamma", 
    items: 321, 
    status: "completed", 
    timestamp: "Yesterday", 
    user: "Sarah Williams" 
  },
];

const mockSales = [
  { id: "s1", location: "Store Alpha", amount: 5280, trend: "up", percentage: 12 },
  { id: "s2", location: "Store Beta", amount: 4350, trend: "up", percentage: 8 },
  { id: "s3", location: "Store Gamma", amount: 3120, trend: "down", percentage: 3 },
];

const Index = () => {
  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your inventory and recent activity"
      >
        <Button>Create Report</Button>
      </PageHeader>
      
      <PageContent>
        <div className="space-y-8">
          {/* Stock Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>
            <StockOverview />
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View all</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockRecentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className={cn(
                        "p-2 rounded-full flex-shrink-0",
                        activity.type === "transfer" ? "bg-blue-50 text-blue-500" :
                        activity.type === "restock" ? "bg-green-50 text-green-500" :
                        "bg-amber-50 text-amber-500"
                      )}>
                        {activity.type === "transfer" ? (
                          <ArrowRight className="h-5 w-5" />
                        ) : activity.type === "restock" ? (
                          <Package className="h-5 w-5" />
                        ) : (
                          <Store className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.items} items • {activity.user} • {activity.timestamp}
                            </p>
                          </div>
                          
                          <div className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium",
                            activity.status === "completed" ? "bg-green-50 text-green-600" : 
                            "bg-amber-50 text-amber-600"
                          )}>
                            {activity.status === "completed" ? "Completed" : "In Progress"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {mockSales.map((sale) => (
                    <div key={sale.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{sale.location}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {sale.trend === "up" ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                              <span className="text-green-500">+{sale.percentage}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                              <span className="text-red-500">-{sale.percentage}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">${sale.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">this month</span>
                      </div>
                      
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            sale.trend === "up" ? "bg-green-500" : "bg-red-500" 
                          )}
                          style={{ width: `${40 + sale.percentage * 4}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full gap-1">
                      <span>View Sales Report</span>
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContent>
    </Layout>
  );
};

export default Index;

// Helper function since we're using it in this component
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
