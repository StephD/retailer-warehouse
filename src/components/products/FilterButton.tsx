
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FilterButton() {
  return (
    <Button variant="outline" size="sm" className="gap-1">
      <Filter className="h-4 w-4" />
      <span>Filter</span>
    </Button>
  );
}
