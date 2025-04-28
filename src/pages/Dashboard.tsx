
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressCard } from "@/components/ui/progress-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarClock, 
  Check, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ListChecks, 
  UserCheck 
} from "lucide-react";
import { getDashboardStats, mockProjects } from "@/data/mockData";
import { DonutChart } from "@/components/charts/DonutChart";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const stats = getDashboardStats();

  // Task status data for chart
  const taskStatusData = [
    { name: "To Do", value: stats.totalTasks - stats.completedTasks, color: "#9CA3AF" },
    { name: "Completed", value: stats.completedTasks, color: "#6366F1" },
  ];

  // Priority distribution for chart
  const priorityData = [
    { 
      name: "High", 
      value: mockProjects.flatMap(p => p.tasks).filter(t => t.priority === "high").length,
      color: "#F76C6C" 
    },
    { 
      name: "Medium", 
      value: mockProjects.flatMap(p => p.tasks).filter(t => t.priority === "medium").length,
      color: "#F8A34C" 
    },
    { 
      name: "Low", 
      value: mockProjects.flatMap(p => p.tasks).filter(t => t.priority === "low").length,
      color: "#57C4AD" 
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-baseline">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your project overview for today.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={<Layers className="h-4 w-4" />}
            trend="up"
            change={12}
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={<ListChecks className="h-4 w-4" />}
            trend="up"
            change={8}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={<CheckCircle2 className="h-4 w-4" />}
            trend="up"
            change={16}
          />
          <StatCard
            title="Team Members"
            value={mockProjects[0].members.length}
            icon={<UserCheck className="h-4 w-4" />}
            trend="neutral"
            change={0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressCard
            title="Tasks Completion Rate"
            value={stats.tasksCompletionRate}
            icon={<Check className="h-4 w-4" />}
            color="bg-primary"
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProjects[0].tasks.slice(0, 4).map((task, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src={task.assignee?.avatar} />
                    <AvatarFallback>{task.assignee?.name.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{task.assignee?.name}</span>
                      {" "}
                      <span className="text-muted-foreground">
                        {task.status === "done" ? "completed" : "updated"}
                      </span>
                      {" "}
                      <span className="font-medium">{task.title}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(task.createdDate, "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DonutChart 
            title="Task Status" 
            data={taskStatusData} 
          />
          <DonutChart 
            title="Priority Distribution" 
            data={priorityData} 
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ProjectTimeline 
            items={mockProjects.map(project => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress,
              color: `hsl(${220 + mockProjects.indexOf(project) * 30}, 70%, 60%)`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks due within the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.upcomingDeadlines.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.projectId.replace("project-", "Project ")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.dueDate && format(task.dueDate, "MMM d")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Overdue Tasks</CardTitle>
              <CardDescription>Tasks that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.overdueDeadlines.length > 0 ? (
                  stats.overdueDeadlines.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarClock className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.projectId.replace("project-", "Project ")}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-destructive">
                        {task.dueDate && format(task.dueDate, "MMM d")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No overdue tasks! 🎉</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
