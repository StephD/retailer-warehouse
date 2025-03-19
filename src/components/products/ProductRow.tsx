
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductActions } from "./ProductActions";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  supplier: string | null;
  in_stock?: number;
  attributes?: Record<string, string>; // Add attributes
}

interface ProductRowProps {
  product: Product;
  onDeleteProduct: (id: string) => void;
}

export function ProductRow({ product, onDeleteProduct }: ProductRowProps) {
  // Get key attributes to display (limited to 2 for space)
  const attributeEntries = product.attributes ? Object.entries(product.attributes).slice(0, 2) : [];

  return (
    <TableRow key={product.id} className="group">
      <TableCell className="font-medium">
        <div>
          {product.name}
          {product.supplier && (
            <div className="text-xs text-muted-foreground mt-1">
              {product.supplier}
            </div>
          )}
          {attributeEntries.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {attributeEntries.map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell>
        <Badge variant="secondary">{product.category}</Badge>
      </TableCell>
      <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
      <TableCell className="text-right">${Number(product.cost).toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "font-medium",
          product.in_stock < 30 ? "text-red-500" : 
          product.in_stock < 50 ? "text-amber-500" : "text-green-500"
        )}>
          {product.in_stock}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <ProductActions 
          productId={product.id} 
          productName={product.name} 
          onDeleteProduct={onDeleteProduct} 
        />
      </TableCell>
    </TableRow>
  );
}
