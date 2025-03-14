
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neo';
  hoverable?: boolean;
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hoverable = false,
}: CardProps) {
  const baseStyles = "rounded-xl overflow-hidden transition-all duration-300";
  
  const variantStyles = {
    default: "bg-card shadow-sm",
    glass: "glass-panel shadow-glass",
    neo: "neo-card",
  };
  
  const hoverStyles = hoverable ? "hover:shadow-medium hover:translate-y-[-2px]" : "";
  
  return (
    <div className={cn(
      baseStyles,
      variantStyles[variant],
      hoverStyles,
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-6 flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("font-semibold text-lg tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function CardContent({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)}>
      {children}
    </div>
  );
}
