
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockProjects, getTasksByStatus } from "@/data/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChart } from "@/components/charts/DonutChart";
import { KanbanBoard } from "@/components/task/KanbanBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  CalendarDays, 
  CheckSquare, 
  ClockIcon, 
  Edit, 
  MoreHorizontal,
  Plus,
  Trash, 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const project = mockProjects.find((p) => p.id === id);
  
  if (!project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    );
  }

  const tasksByStatus = getTasksByStatus(project.id);
  
  const handleTaskClick = (taskId: string) => {
    toast({
      title: "Task Selected",
      description: `You clicked on task ${taskId}`,
    });
  };

  const handleAddTask = (columnId: string) => {
    toast({
      title: "Add Task",
      description: `Adding a new task to ${columnId}`,
    });
  };

  // Task data for donut chart
  const taskStatusData = [
    { name: "To Do", value: tasksByStatus.todo.length, color: "#9CA3AF" },
    { name: "In Progress", value: tasksByStatus["in-progress"].length, color: "#60A5FA" },
    { name: "Review", value: tasksByStatus.review.length, color: "#F59E0B" },
    { name: "Done", value: tasksByStatus.done.length, color: "#6366F1" },
  ];
  
  // Task priority data for donut chart
  const taskPriorityData = [
    { name: "High", value: project.tasks.filter(t => t.priority === "high").length, color: "#F76C6C" },
    { name: "Medium", value: project.tasks.filter(t => t.priority === "medium").length, color: "#F8A34C" },
    { name: "Low", value: project.tasks.filter(t => t.priority === "low").length, color: "#57C4AD" },
  ];
  
  const completedTasks = project.tasks.filter(task => task.status === "done").length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <Badge 
            variant="outline" 
            className="ml-auto"
          >
            {project.progress === 100 ? "Completed" : "In Progress"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" /> Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-muted-foreground">{project.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{project.progress}%</div>
                <div 
                  className="progress-bar"
                  style={{"--progress-value": `${project.progress}%`} as React.CSSProperties}
                >
                  <div className="progress-value"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(project.startDate, "MMM d, yyyy")} - {format(project.endDate, "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{completedTasks}</span>
                  <span className="text-muted-foreground">/ {project.tasks.length}</span>
                </div>
                <span className="text-sm text-muted-foreground">completed</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.members.map((member, index) => (
                  <Avatar key={index} className="h-8 w-8 border border-muted">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="mt-6">
            <KanbanBoard 
              columns={[
                { id: "todo", title: "To Do", tasks: tasksByStatus.todo },
                { id: "in-progress", title: "In Progress", tasks: tasksByStatus["in-progress"] },
                { id: "review", title: "Review", tasks: tasksByStatus.review },
                { id: "done", title: "Done", tasks: tasksByStatus.done },
              ]}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
              className="pb-20"
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-md flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer ${
                        task.priority === "high" 
                          ? "border-l-4 border-l-priority-high" 
                          : task.priority === "medium" 
                          ? "border-l-4 border-l-priority-medium" 
                          : "border-l-4 border-l-priority-low"
                      }`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="flex flex-col">
                        <h3 className="font-medium">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          {task.dueDate && format(task.dueDate, "MMM d")}
                        </div>
                        {task.assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DonutChart 
                title="Task Status" 
                data={taskStatusData} 
              />
              <DonutChart 
                title="Task Priority" 
                data={taskPriorityData} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
