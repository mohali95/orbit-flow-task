
import { addDays, subDays } from "date-fns";

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  members: TeamMember[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  createdDate: Date;
  tags: string[];
  assignee?: TeamMember;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

// Mock team members
export const mockTeamMembers: TeamMember[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/150?img=1",
    email: "alex@example.com",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    role: "UX Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "sarah@example.com",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    role: "Developer",
    avatar: "https://i.pravatar.cc/150?img=8",
    email: "michael@example.com",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    role: "Marketing",
    avatar: "https://i.pravatar.cc/150?img=9",
    email: "emily@example.com",
  },
];

// Mock tasks
export const generateMockTasks = (projectId: string): Task[] => {
  return [
    {
      id: `task-${projectId}-1`,
      projectId,
      title: "Research competitor products",
      description:
        "Analyze the top 5 competitor products and create a comparison report",
      status: "done",
      priority: "high",
      dueDate: subDays(new Date(), 5),
      createdDate: subDays(new Date(), 10),
      tags: ["research", "marketing"],
      assignee: mockTeamMembers[3],
    },
    {
      id: `task-${projectId}-2`,
      projectId,
      title: "Create wireframes for homepage",
      description:
        "Design initial wireframes for the homepage based on the requirements",
      status: "done",
      priority: "high",
      dueDate: subDays(new Date(), 3),
      createdDate: subDays(new Date(), 8),
      tags: ["design", "ui"],
      assignee: mockTeamMembers[1],
    },
    {
      id: `task-${projectId}-3`,
      projectId,
      title: "Implement user authentication",
      description:
        "Set up user authentication system including login, signup and password reset",
      status: "in-progress",
      priority: "high",
      dueDate: addDays(new Date(), 2),
      createdDate: subDays(new Date(), 6),
      tags: ["development", "backend"],
      assignee: mockTeamMembers[2],
    },
    {
      id: `task-${projectId}-4`,
      projectId,
      title: "Design product detail page",
      description: "Create high-fidelity design for the product detail page",
      status: "in-progress",
      priority: "medium",
      dueDate: addDays(new Date(), 4),
      createdDate: subDays(new Date(), 5),
      tags: ["design", "ui"],
      assignee: mockTeamMembers[1],
    },
    {
      id: `task-${projectId}-5`,
      projectId,
      title: "Implement API endpoints",
      description: "Create backend API endpoints for product and user data",
      status: "todo",
      priority: "medium",
      dueDate: addDays(new Date(), 7),
      createdDate: subDays(new Date(), 4),
      tags: ["development", "api"],
      assignee: mockTeamMembers[2],
    },
    {
      id: `task-${projectId}-6`,
      projectId,
      title: "Set up content management system",
      description:
        "Configure CMS for managing product content and marketing materials",
      status: "todo",
      priority: "low",
      dueDate: addDays(new Date(), 10),
      createdDate: subDays(new Date(), 3),
      tags: ["setup", "content"],
      assignee: mockTeamMembers[0],
    },
    {
      id: `task-${projectId}-7`,
      projectId,
      title: "Prepare product launch plan",
      description:
        "Create a comprehensive marketing plan for the product launch",
      status: "todo",
      priority: "high",
      dueDate: addDays(new Date(), 14),
      createdDate: subDays(new Date(), 2),
      tags: ["marketing", "planning"],
      assignee: mockTeamMembers[3],
    },
  ];
};

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "E-commerce Platform Redesign",
    description: "Redesigning the UI/UX of the main e-commerce platform",
    progress: 65,
    startDate: subDays(new Date(), 30),
    endDate: addDays(new Date(), 45),
    members: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2]],
    tasks: [],
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "Creating a new mobile application for customers",
    progress: 40,
    startDate: subDays(new Date(), 15),
    endDate: addDays(new Date(), 60),
    members: [mockTeamMembers[0], mockTeamMembers[2], mockTeamMembers[3]],
    tasks: [],
  },
  {
    id: "project-3",
    name: "Marketing Campaign Q2",
    description: "Planning and executing the Q2 marketing campaign",
    progress: 20,
    startDate: subDays(new Date(), 5),
    endDate: addDays(new Date(), 80),
    members: [mockTeamMembers[0], mockTeamMembers[3]],
    tasks: [],
  },
  {
    id: "project-4",
    name: "Product Feature Expansion",
    description: "Adding new features to the core product",
    progress: 10,
    startDate: addDays(new Date(), 5),
    endDate: addDays(new Date(), 90),
    members: mockTeamMembers,
    tasks: [],
  },
];

// Add tasks to projects
mockProjects.forEach(project => {
  project.tasks = generateMockTasks(project.id);
});

// Get tasks grouped by status for a specific project
export const getTasksByStatus = (projectId: string) => {
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) return [];
  
  const tasksByStatus = {
    todo: project.tasks.filter(task => task.status === "todo"),
    "in-progress": project.tasks.filter(task => task.status === "in-progress"),
    review: project.tasks.filter(task => task.status === "review"),
    done: project.tasks.filter(task => task.status === "done"),
  };
  
  return tasksByStatus;
};

// Get stats for dashboard
export const getDashboardStats = () => {
  const totalTasks = mockProjects.reduce(
    (count, project) => count + project.tasks.length, 
    0
  );
  
  const completedTasks = mockProjects.reduce(
    (count, project) => 
      count + project.tasks.filter(task => task.status === "done").length, 
    0
  );
  
  const upcomingDeadlines = mockProjects.flatMap(project => 
    project.tasks.filter(task => 
      task.status !== "done" && 
      task.dueDate && 
      task.dueDate > new Date() && 
      task.dueDate < addDays(new Date(), 7)
    )
  );
  
  const overdueDeadlines = mockProjects.flatMap(project => 
    project.tasks.filter(task => 
      task.status !== "done" && 
      task.dueDate && 
      task.dueDate < new Date()
    )
  );
  
  return {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter(p => p.progress < 100).length,
    totalTasks,
    completedTasks,
    tasksCompletionRate: Math.round((completedTasks / totalTasks) * 100),
    upcomingDeadlines,
    overdueDeadlines,
  };
};
