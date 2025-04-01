import { defineStore } from 'pinia';
import { getProjects } from './projectService';

// Define Interface
interface Project {
  projectId: string | number;
  projectName: string;
  projectIcon: string;
  createdBy?: string | number;
}

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    activeProjectId: null as number | null,
    activeProjectName: '' as string,
    activeProjectIcon: '' as string,
    activeProjectCreatedBy: '' as string | number, 
    projects: [] as Project[],
  }),
  actions: {
    // Set the currently active project
    setActiveProject(projectId: number, projectName: string, projectIcon: string, createdBy: string | number) {
      this.activeProjectId = projectId;
      this.activeProjectName = projectName;
      this.activeProjectIcon = projectIcon;
      this.activeProjectCreatedBy = createdBy;
      console.log(`Active Project is ${projectName} [${projectId}]`);
    },

    // Fetch all projects and update the store
    async fetchProjects() {
      this.projects = await getProjects();
    },
  },
});