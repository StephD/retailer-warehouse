
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter, Download, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for stock movements history
const mockMovements = [
  { 
    id: "MOV-12345",
    date: "2023-06-20 14:32",
    type: "transfer",
    from: "Main Warehouse",
    to: "Store Alpha",
    items: 18,
    user: "John Smith",
    status: "completed"
  },
  { 
    id: "MOV-12346",
    date: "2023-06-19 10:15",
    type: "adjustment",
    from: "Store Beta",
    to: "",
    items: 5,
    user: "Sarah Johnson",
    status: "completed"
  },
  { 
    id: "MOV-12347",
    date: "2023-06-18 16:45",
    type: "return",
    from: "Store Gamma",
    to: "Main Warehouse",
    items: 7,
    user: "Mike Brown",
    status: "pending"
  },
  { 
    id: "MOV-12348",
    date: "2023-06-17 09:22",
    type: "transfer",
    from: "Main Warehouse",
    to: "Store Beta",
    items: 24,
    user: "John Smith",
    status: "completed"
  },
  { 
    id: "MOV-12349",
    date: "2023-06-16 11:30",
    type: "adjustment",
    from: "Store Alpha",
    to: "",
    items: 3,
    user: "Emily Davis",
    status: "rejected"
  },
  { 
    id: "MOV-12350",
    date: "2023-06-15 15:18",
    type: "transfer",
    from: "Main Warehouse",
    to: "Store Gamma",
    items: 12,
    user: "Robert Wilson",
    status: "completed"
  },
  { 
    id: "MOV-12351",
    date: "2023-06-14 13:45",
    type: "return",
    from: "Store Beta",
    to: "Main Warehouse",
    items: 4,
    user: "Sarah Johnson",
    status: "completed"
  },
];

const History = () => {
  return (
    <Layout>
      <PageHeader 
        title="Stock Movement History"
        description="Track all inventory movements across your locations"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </PageHeader>
      
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>All Movements</CardTitle>
            <CardDescription>
              Complete history of inventory movements, transfers, returns, and adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        ID
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMovements.map((movement) => (
                    <TableRow key={movement.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <a href="#" className="hover:text-primary hover:underline">
                          {movement.id}
                        </a>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {movement.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            movement.type === "transfer" && "bg-blue-50 text-blue-600 hover:bg-blue-100",
                            movement.type === "return" && "bg-amber-50 text-amber-600 hover:bg-amber-100",
                            movement.type === "adjustment" && "bg-purple-50 text-purple-600 hover:bg-purple-100",
                          )}
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.from}</TableCell>
                      <TableCell>{movement.to || "—"}</TableCell>
                      <TableCell className="text-right">{movement.items}</TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn(
                          "gap-1",
                          movement.status === "completed" ? "bg-green-50 text-green-600 hover:bg-green-100" :
                          movement.status === "pending" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" :
                          "bg-red-50 text-red-600 hover:bg-red-100"
                        )}>
                          <span className="capitalize">{movement.status}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Layout>
  );
};

export default History;
