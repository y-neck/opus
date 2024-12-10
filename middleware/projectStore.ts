import {defineStore} from 'pinia';

export const useProjectStore = defineStore('projectStore', {
    state: () => ({
        activeProjectId: null as number | null, // Active project ID
    }),
    actions: {
        setActiveProject(projectId: number) {
            // DEBUG:
            console.log(`Setting active project to: ${projectId}`);
            // Set the active project ID
            this.activeProjectId = projectId;
            // DEBUG:
            console.log(`New active project ID: ${this.activeProjectId}`);
        }
    }
})