
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Attribute, AttributeOption } from "@/types/attributes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AttributeFieldProps {
  attribute: Attribute;
  value: string;
  onChange: (value: string) => void;
  control: any;
}

export function AttributeField({ attribute, value, onChange, control }: AttributeFieldProps) {
  // Fetch attribute options if this is a select type attribute
  const { data: options = [] } = useQuery({
    queryKey: ['attributeOptions', attribute.id],
    queryFn: async () => {
      if (attribute.type !== 'select') return [];
      
      const { data, error } = await supabase
        .from('attribute_options')
        .select('*')
        .eq('attribute_id', attribute.id)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching attribute options:', error);
        return [];
      }
      
      // Type assertion to ensure the correct type
      return (data || []) as AttributeOption[];
    },
    enabled: attribute.type === 'select'
  });

  const renderFieldInput = () => {
    switch (attribute.type) {
      case 'text':
        return (
          <FormField
            name={`attributes.${attribute.id}`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attribute.name}{attribute.is_required && ' *'}</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder={`Enter ${attribute.name.toLowerCase()}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'number':
        return (
          <FormField
            name={`attributes.${attribute.id}`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attribute.name}{attribute.is_required && ' *'}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    placeholder={`Enter ${attribute.name.toLowerCase()}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'boolean':
        return (
          <FormField
            name={`attributes.${attribute.id}`}
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={value === 'true'}
                    onCheckedChange={(checked) => {
                      onChange(checked ? 'true' : 'false');
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{attribute.name}{attribute.is_required && ' *'}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        );
        
      case 'select':
        return (
          <FormField
            name={`attributes.${attribute.id}`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attribute.name}{attribute.is_required && ' *'}</FormLabel>
                <Select
                  onValueChange={onChange}
                  defaultValue={value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${attribute.name.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      default:
        return null;
    }
  };

  return renderFieldInput();
}
