
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 w-full">
          <div className="container mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
        
        <footer className="py-6 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 RetailStock. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({ 
  title, 
  description, 
  children 
}: { 
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
      "pb-6 border-b border-border"
    )}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      {children && (
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
