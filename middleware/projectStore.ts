import {defineStore} from 'pinia';

export const useProjectStore = defineStore('projectStore', {
    state: () => ({
        activeProjectId: null as number | null, // Active project ID
        activeProjectName: '' as string // Active project name
    }),
    actions: {
        setActiveProject(projectId: number, projectName: string) {
            // // DEBUG:
            // console.log(`Setting active project to: ${projectId}`);
            // Set the active project ID
            this.activeProjectId = projectId;
            this.activeProjectName = projectName;
            // DEBUG:
            console.log(`New active project ID: ${this.activeProjectId}, ${this.activeProjectName}`);
        }
    }
})