
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { TransferForm } from "@/components/transfers/TransferForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Filter, Clock, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data
const mockTransfers = [
  {
    id: "T-12345",
    date: "2023-06-15",
    from: "Main Warehouse",
    to: "Store Alpha",
    items: 28,
    status: "completed",
    createdBy: "John Smith",
  },
  {
    id: "T-12346",
    date: "2023-06-14",
    from: "Store Beta",
    to: "Main Warehouse",
    items: 12,
    status: "pending",
    createdBy: "Mike Johnson",
  },
  {
    id: "T-12347",
    date: "2023-06-13",
    from: "Main Warehouse",
    to: "Store Gamma",
    items: 35,
    status: "completed",
    createdBy: "Jane Doe",
  },
  {
    id: "T-12348",
    date: "2023-06-12",
    from: "Store Alpha",
    to: "Store Beta",
    items: 5,
    status: "rejected",
    createdBy: "Sarah Williams",
  },
  {
    id: "T-12349",
    date: "2023-06-10",
    from: "Main Warehouse",
    to: "Store Beta",
    items: 42,
    status: "completed",
    createdBy: "John Smith",
  },
];

const Transfers = () => {
  return (
    <Layout>
      <PageHeader 
        title="Stock Transfers"
        description="Transfer inventory between locations"
      />
      
      <PageContent>
        <Tabs defaultValue="create" className="animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="create" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Create Transfer</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              <span>Transfer History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="animate-fade-in">
            <TransferForm />
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>
                      Recent stock movements between locations
                    </CardDescription>
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-1 self-start">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transfer ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransfers.map((transfer) => (
                        <TableRow key={transfer.id} className="group hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <a href="#" className="hover:text-primary hover:underline">
                              {transfer.id}
                            </a>
                          </TableCell>
                          <TableCell>{transfer.date}</TableCell>
                          <TableCell>{transfer.from}</TableCell>
                          <TableCell>{transfer.to}</TableCell>
                          <TableCell className="text-right">{transfer.items}</TableCell>
                          <TableCell>{transfer.createdBy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Badge className={cn(
                                "gap-1",
                                transfer.status === "completed" ? "bg-green-50 text-green-600 hover:bg-green-100" :
                                transfer.status === "pending" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" :
                                "bg-red-50 text-red-600 hover:bg-red-100"
                              )}>
                                {transfer.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                                {transfer.status === "pending" && <Clock className="h-3 w-3" />}
                                {transfer.status === "rejected" && <XCircle className="h-3 w-3" />}
                                <span className="capitalize">{transfer.status}</span>
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContent>
    </Layout>
  );
};

export default Transfers;
