
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { mockProjects } from "@/data/mockData";
import { format, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

// Flatten all tasks from all projects
const allTasks = mockProjects.flatMap((project) =>
  project.tasks
    .filter(task => task.dueDate) // Only get tasks with due dates
    .map((task) => ({
      ...task,
      projectName: project.name,
      project,
    }))
);

const Calendar = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"month" | "day">("month");
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentView("day");
    }
  };
  
  const handleViewChange = (view: "month" | "day") => {
    setCurrentView(view);
  };
  
  const handlePrevNextDay = (direction: "prev" | "next") => {
    const newDate = direction === "prev" 
      ? addDays(selectedDate, -1) 
      : addDays(selectedDate, 1);
    setSelectedDate(newDate);
  };
  
  const handleTaskClick = (taskId: string) => {
    toast({
      title: "Task Selected",
      description: `You clicked on task ${taskId}`,
      duration: 2000,
    });
  };
  
  // Get tasks for the selected date
  const tasksForSelectedDate = allTasks.filter((task) => 
    task.dueDate && isSameDay(task.dueDate, selectedDate)
  );
  
  // Calculate which days in the current month have tasks
  const currentMonthStart = startOfMonth(selectedDate);
  const currentMonthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({
    start: currentMonthStart,
    end: currentMonthEnd,
  });
  
  const daysWithTasks = daysInMonth.reduce<Record<string, number>>((acc, day) => {
    const tasksForDay = allTasks.filter(
      (task) => task.dueDate && isSameDay(task.dueDate, day)
    );
    
    if (tasksForDay.length > 0) {
      acc[format(day, "yyyy-MM-dd")] = tasksForDay.length;
    }
    
    return acc;
  }, {});
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Schedule and track your tasks and deadlines
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleViewChange("month")} className={cn(
              currentView === "month" && "bg-secondary"
            )}>
              Month
            </Button>
            <Button variant="outline" onClick={() => handleViewChange("day")} className={cn(
              currentView === "day" && "bg-secondary"
            )}>
              Day
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>
        </div>
        
        {currentView === "month" ? (
          <Card className="p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="mx-auto max-w-md"
              components={{
                DayContent: (props) => {
                  const dateKey = format(props.date, "yyyy-MM-dd");
                  const taskCount = daysWithTasks[dateKey] || 0;
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div 
                        className={cn(
                          "w-full h-full flex items-center justify-center",
                          isToday(props.date) && "bg-primary/10 rounded-full",
                        )}
                      >
                        {props.day}
                      </div>
                      {taskCount > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {[...Array(Math.min(taskCount, 3))].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1.5 h-1.5 rounded-full bg-primary" 
                            />
                          ))}
                          {taskCount > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handlePrevNextDay("prev")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleViewChange("month")}
                className="flex gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => handlePrevNextDay("next")}>
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              {!isToday(selectedDate) && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
              )}
            </div>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Tasks
                </h2>
                <Badge variant="outline">
                  {tasksForSelectedDate.length} tasks
                </Badge>
              </div>
              
              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No tasks for today</h3>
                  <p className="text-muted-foreground">
                    You don't have any tasks due on this day
                  </p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "p-4 border rounded-md flex justify-between items-start cursor-pointer hover:bg-secondary/50 transition-colors",
                        task.priority === "high" 
                          ? "border-l-4 border-l-priority-high" 
                          : task.priority === "medium" 
                          ? "border-l-4 border-l-priority-medium" 
                          : "border-l-4 border-l-priority-low"
                      )}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant="outline" className={cn(
                            task.priority === "high" 
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                              : task.priority === "medium" 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" 
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          )}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{task.status}</Badge>
                          <Badge variant="outline">{task.projectName}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-muted-foreground">
                          {task.assignee?.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Calendar;
