
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockProjects } from "@/data/mockData";
import { format } from "date-fns";
import { TaskCard } from "@/components/task/TaskCard";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Flatten all tasks from all projects
const allTasks = mockProjects.flatMap((project) =>
  project.tasks.map((task) => ({
    ...task,
    projectName: project.name,
  }))
);

type SortOption = "dueDate" | "priority" | "status" | "project";
type FilterOption = "high" | "medium" | "low" | "todo" | "in-progress" | "review" | "done";

const Tasks = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [filters, setFilters] = useState<FilterOption[]>([]);
  
  const handleTaskClick = (taskId: string) => {
    toast({
      title: "Task Selected",
      description: `You clicked on task ${taskId}`,
      duration: 2000,
    });
  };
  
  // Filter tasks based on search query and selected filters
  const filteredTasks = allTasks.filter((task) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    // Priority and status filters
    const matchesPriority = filters.length === 0 || 
      (filters.includes("high") && task.priority === "high") ||
      (filters.includes("medium") && task.priority === "medium") ||
      (filters.includes("low") && task.priority === "low");
      
    const matchesStatus = filters.length === 0 ||
      (filters.includes("todo") && task.status === "todo") ||
      (filters.includes("in-progress") && task.status === "in-progress") ||
      (filters.includes("review") && task.status === "review") ||
      (filters.includes("done") && task.status === "done");
    
    return matchesSearch && matchesPriority && matchesStatus;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        // Sort by due date (tasks without due date come last)
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      
      case "priority":
        // Sort by priority (high > medium > low)
        const priorityValue = { high: 3, medium: 2, low: 1 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      
      case "status":
        // Sort by status (todo > in-progress > review > done)
        const statusValue = { todo: 4, "in-progress": 3, review: 2, done: 1 };
        return statusValue[b.status] - statusValue[a.status];
      
      case "project":
        // Sort by project name
        return a.projectName.localeCompare(b.projectName);
      
      default:
        return 0;
    }
  });
  
  const toggleFilter = (value: FilterOption) => {
    setFilters((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage all your tasks across projects
            </p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Task
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {filteredTasks.length} tasks
            </Badge>
            
            {filters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFilters([])}
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sliders className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("high")}
                  onCheckedChange={() => toggleFilter("high")}
                >
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("medium")}
                  onCheckedChange={() => toggleFilter("medium")}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("low")}
                  onCheckedChange={() => toggleFilter("low")}
                >
                  Low
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("todo")}
                  onCheckedChange={() => toggleFilter("todo")}
                >
                  To Do
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("in-progress")}
                  onCheckedChange={() => toggleFilter("in-progress")}
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("review")}
                  onCheckedChange={() => toggleFilter("review")}
                >
                  Review
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.includes("done")}
                  onCheckedChange={() => toggleFilter("done")}
                >
                  Done
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy === "dueDate" ? "Due Date" : 
                         sortBy === "priority" ? "Priority" : 
                         sortBy === "status" ? "Status" : "Project"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={sortBy === "dueDate"}
                  onCheckedChange={() => setSortBy("dueDate")}
                >
                  Due Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "priority"}
                  onCheckedChange={() => setSortBy("priority")}
                >
                  Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "status"}
                  onCheckedChange={() => setSortBy("status")}
                >
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "project"}
                  onCheckedChange={() => setSortBy("project")}
                >
                  Project
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Separator />
        
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No tasks found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.dueDate}
                tags={[
                  ...(task.tags || []),
                  task.projectName.replace("Project ", "P"),
                ]}
                assignee={task.assignee}
                onClick={() => handleTaskClick(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;
