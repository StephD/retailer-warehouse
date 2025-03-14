
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, UserCircle2, ShieldCheck, Shield, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for users
const mockUsers = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@example.com",
    role: "super_admin",
    status: "active",
    lastActive: "2023-06-20 09:45",
    avatar: "/placeholder.svg"
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    email: "sarah.johnson@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-06-19 14:22",
    avatar: "/placeholder.svg"
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael.brown@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-06-18 11:10",
    avatar: "/placeholder.svg"
  },
  { 
    id: 4, 
    name: "Emily Davis", 
    email: "emily.davis@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-06-17 15:30",
    avatar: "/placeholder.svg"
  },
  { 
    id: 5, 
    name: "Robert Wilson", 
    email: "robert.wilson@example.com",
    role: "admin",
    status: "inactive",
    lastActive: "2023-05-30 08:45",
    avatar: "/placeholder.svg"
  },
  { 
    id: 6, 
    name: "Jennifer Lee", 
    email: "jennifer.lee@example.com",
    role: "user",
    status: "pending",
    lastActive: "Not yet logged in",
    avatar: "/placeholder.svg"
  },
];

const getUserRoleBadge = (role: string) => {
  switch (role) {
    case "super_admin":
      return (
        <Badge className="bg-red-50 text-red-600 hover:bg-red-100 gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Super Admin</span>
        </Badge>
      );
    case "admin":
      return (
        <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 gap-1">
          <Shield className="h-3 w-3" />
          <span>Admin</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 gap-1">
          <UserCircle2 className="h-3 w-3" />
          <span>User</span>
        </Badge>
      );
  }
};

const getUserStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-50 text-green-600 hover:bg-green-100">
          Active
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-gray-50 text-gray-600 hover:bg-gray-100">
          Inactive
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100">
          Pending
        </Badge>
      );
    default:
      return null;
  }
};

const Users = () => {
  const handleAddUser = () => {
    toast.info("Add user functionality coming soon!");
  };

  const handleEditUser = (userId: number) => {
    toast.info(`Edit user ${userId} functionality coming soon!`);
  };

  const handleDeleteUser = (userId: number) => {
    toast.info(`Delete user ${userId} functionality coming soon!`);
  };

  return (
    <Layout>
      <PageHeader 
        title="User Management"
        description="Manage user accounts and permissions"
      >
        <Button onClick={handleAddUser} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </PageHeader>
      
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full"
              />
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Active
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className={cn(
                              user.role === "super_admin" ? "bg-red-100 text-red-600" :
                              user.role === "admin" ? "bg-amber-100 text-amber-600" :
                              "bg-blue-100 text-blue-600"
                            )}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getUserRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getUserStatusBadge(user.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.lastActive}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Layout>
  );
};

export default Users;
