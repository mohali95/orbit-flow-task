
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  tags?: string[];
  assignee?: {
    name: string;
    avatar?: string;
  };
  className?: string;
  onClick?: () => void;
}

export const TaskCard = ({
  id,
  title,
  description,
  priority,
  dueDate,
  tags,
  assignee,
  className,
  onClick,
}: TaskCardProps) => {
  const priorityClass = {
    high: "task-card-high",
    medium: "task-card-medium",
    low: "task-card-low",
  }[priority];
  
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  }[priority];

  const tagColors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  ];
  
  return (
    <div
      className={cn(
        "task-card group cursor-pointer animate-fade-in",
        priorityClass,
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        <Badge variant="outline" className={cn("ml-2", priorityColors)}>
          {priority}
        </Badge>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
      )}
      
      <div className="mt-4 flex flex-wrap gap-1">
        {tags?.map((tag, index) => (
          <span
            key={tag}
            className={cn(
              "tag",
              tagColors[index % tagColors.length]
            )}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        {assignee && (
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {assignee.name}
            </span>
          </div>
        )}
        
        {dueDate && (
          <span className="text-xs text-muted-foreground ml-auto">
            Due {formatDistanceToNow(dueDate, { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
};
