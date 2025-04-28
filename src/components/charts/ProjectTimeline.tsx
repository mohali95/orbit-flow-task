
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  progress: number;
}

interface ProjectTimelineProps {
  items: ProjectItem[];
  className?: string;
}

export const ProjectTimeline = ({ items, className }: ProjectTimelineProps) => {
  // Find the earliest and latest dates for scaling
  const earliestDate = items.reduce(
    (earliest, item) => 
      item.startDate < earliest ? item.startDate : earliest,
    items[0]?.startDate || new Date()
  );
  
  const latestDate = items.reduce(
    (latest, item) => 
      item.endDate > latest ? item.endDate : latest,
    items[0]?.endDate || new Date()
  );
  
  // Total duration in milliseconds
  const totalDuration = latestDate.getTime() - earliestDate.getTime();
  
  const calculatePosition = (date: Date) => {
    return ((date.getTime() - earliestDate.getTime()) / totalDuration) * 100;
  };
  
  const calculateWidth = (startDate: Date, endDate: Date) => {
    return ((endDate.getTime() - startDate.getTime()) / totalDuration) * 100;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] mt-2">
          {items.map((item, index) => {
            const left = calculatePosition(item.startDate);
            const width = calculateWidth(item.startDate, item.endDate);
            
            return (
              <div 
                key={item.id}
                className="absolute h-8 flex items-center group"
                style={{
                  top: `${index * 40}px`,
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                <div 
                  className={cn(
                    "h-6 w-full rounded-md relative overflow-hidden",
                    item.color || "bg-blue-500/20"
                  )}
                >
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-full transition-all duration-300",
                      item.color || "bg-blue-500"
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                    {item.title}
                  </div>
                </div>
                
                <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-popover rounded-md p-2 shadow-md z-10 -top-10 left-0 text-xs whitespace-nowrap">
                  <div className="font-semibold">{item.title}</div>
                  <div>
                    {format(item.startDate, "MMM d")} - {format(item.endDate, "MMM d, yyyy")}
                  </div>
                  <div>{item.progress}% complete</div>
                </div>
              </div>
            );
          })}
          
          {/* Timeline markers */}
          <div className="absolute bottom-0 left-0 right-0 border-t h-6 flex">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div 
                key={percent} 
                className="absolute text-xs text-muted-foreground"
                style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
              >
                {format(
                  new Date(
                    earliestDate.getTime() + 
                    (totalDuration * percent) / 100
                  ),
                  "MMM d"
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
