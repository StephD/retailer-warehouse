
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductActionsProps {
  productId: string;
  productName: string;
  onDeleteProduct: (id: string) => void;
}

export function ProductActions({ productId, productName, onDeleteProduct }: ProductActionsProps) {
  return (
    <div className="flex justify-end items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => toast.info(`Edit ${productName}`)}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => onDeleteProduct(productId)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
