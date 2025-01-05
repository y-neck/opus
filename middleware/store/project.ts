import { defineStore } from 'pinia';
import { getProjects } from './projectService';

// Define Interface
interface Project {
  projectId: string | number;
  projectName: string;
  projectImage: string;
  projectIcon: string
}

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    activeProjectId: null as number | null,
    activeProjectName: '' as string,
    activeProjectIcon: '' as string,
    projects: [] as Project[],
  }),
  actions: {
    // Set the currently active project
    setActiveProject(projectId: number, projectName: string, projectIcon: string) {
      this.activeProjectId = projectId;
      this.activeProjectName = projectName;
      this.activeProjectIcon = projectIcon;
      // Add a console log to check the active project
      console.log(`Active Project is ${projectName} [${projectId}]`);
    },

    // Fetch all projects and update the store
    async fetchProjects() {
      this.projects = await getProjects();
    },
  },
});