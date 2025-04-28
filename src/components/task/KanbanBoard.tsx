
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";

// This is a simplified example of how a Kanban board could be implemented
// In a real app, this would use a proper drag-and-drop library like react-beautiful-dnd

interface Task {
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
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onAddTask?: (columnId: string) => void;
  onTaskClick?: (taskId: string) => void;
  className?: string;
}

export const KanbanBoard = ({
  columns,
  onAddTask,
  onTaskClick,
  className,
}: KanbanBoardProps) => {
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <div 
          key={column.id}
          className={cn(
            "kanban-column",
            activeColumn === column.id && "ring-2 ring-primary/30"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setActiveColumn(column.id);
          }}
          onDragLeave={() => setActiveColumn(null)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{column.title}</h3>
              <Badge variant="outline">{column.tasks.length}</Badge>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7"
              onClick={() => onAddTask?.(column.id)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col gap-3">
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.dueDate}
                tags={task.tags}
                assignee={task.assignee}
                onClick={() => onTaskClick?.(task.id)}
                className="group-hover:shadow-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
