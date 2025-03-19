
import { useState } from "react";
import { Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
}

export function FilterButton({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  
  const hasActiveFilters = selectedCategories.length > 0;
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "gap-1 border-dashed",
            hasActiveFilters && "bg-accent text-accent-foreground border-accent"
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Filter{hasActiveFilters && ` (${selectedCategories.length})`}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onCategoryToggle(category)}
            >
              <span>{category}</span>
              {selectedCategories.includes(category) && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={onClearFilters}
            >
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
