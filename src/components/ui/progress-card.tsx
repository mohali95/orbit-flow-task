
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  className?: string;
  total?: number;
  color?: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
}

export const ProgressCard = ({
  title,
  value,
  icon,
  className,
  total = 100,
  color = "bg-primary",
  unit = "%",
  size = "md",
}: ProgressCardProps) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={cn(
            "font-medium",
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"
          )}>
            {title}
          </CardTitle>
          {icon && <div>{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className={cn(
              "font-semibold",
              size === "sm" ? "text-2xl" : size === "md" ? "text-3xl" : "text-4xl"
            )}>
              {value}{unit}
            </span>
            <span className="text-muted-foreground">of {total}{unit}</span>
          </div>
          <div 
            className="progress-bar"
            style={{"--progress-value": `${percentage}%`} as React.CSSProperties}
          >
            <div className={cn("progress-value", color)}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
