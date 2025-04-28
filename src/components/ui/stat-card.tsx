
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export const StatCard = ({
  title,
  value,
  icon,
  change,
  className,
  trend,
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-medium text-base">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{value}</span>
          {typeof change !== "undefined" && (
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" && (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">{change}% from last month</span>
                </>
              )}
              {trend === "down" && (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">{Math.abs(change)}% from last month</span>
                </>
              )}
              {trend === "neutral" && (
                <span className="text-sm text-muted-foreground">No change from last month</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
