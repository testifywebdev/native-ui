"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockWrapperProps {
  children: React.ReactNode;
  isCollapsible: boolean;
}

export function CodeBlockWrapper({ children, isCollapsible }: CodeBlockWrapperProps) {
  const [isOpened, setIsOpened] = React.useState(false);

  if (!isCollapsible) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          !isOpened ? "max-h-87.5" : "max-h-1250" 
        )}
      >
        {children}
      </div>
      
      <div
        className={cn(
          "absolute flex items-center justify-center p-2",
          isOpened
            ? "inset-x-0 bottom-2 bg-transparent" 
            : "inset-x-0 bottom-0 h-87.5 bg-linear-to-t from-muted/90 to-transparent" 
        )}
      >
        <Button
          onClick={() => setIsOpened(!isOpened)}
          className="rounded-md border cursor-pointer border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isOpened ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
}
