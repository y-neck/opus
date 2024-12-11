/*  Data structure */
// Project Members Interface
export interface ProjectMember {
  id: number;
  name: string;
  role: string;
}
// Task Interface
export interface Task {
  id: number;
  name: string;
  startDate?: {
    // Make optional if some tasks may not have a start date
    day: number;
    month: number;
    year: number;
  };
  dueDate?: {
    // Make optional if some tasks may not have a due date
    day: number;
    month: number;
    year: number;
  };
  status_id: string | number;
  assignedTo: ProjectMember[]; // Use the ProjectMember interface for clarity
  tasksSection?: number; // Use the TaskSection interface for clarity
}
// Task Section Interface
export interface TaskSection {
  index: number;
  name: string;
  tasks: Task[];
}
// Project Interface
export interface Project {
  projectId: string | number;
  projectName: string;
  tasks: Task[]; // Array of tasks for each project
  unsectionedTasks?: Task[]; // Array of tasks that are not assigned to any section
  taskSections?: TaskSection[]; // Array of sections within a project
  projectMembers: ProjectMember[]; // Array of ProjectMember objects for each project's members
  // TODO: add property for project image link
}

// Initialize projectTasks with empty array
const projectTasks: Project[] = [];

export default projectTasks;
