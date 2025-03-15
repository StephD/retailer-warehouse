
import { Product, ProductRow } from "./ProductRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onDeleteProduct: (id: string) => void;
}

export function ProductsTable({ 
  products, 
  isLoading, 
  isError, 
  onDeleteProduct 
}: ProductsTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">In Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Loading products...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-500">
                Error loading products. Please try again.
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductRow 
                key={product.id}
                product={product} 
                onDeleteProduct={onDeleteProduct} 
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
