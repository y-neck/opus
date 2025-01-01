// Define Interface
interface Project {
    projectId: string | number;
    projectName: string;
    projectImage: string;
  }
  
  // Fetch projects from the database
  export async function getProjects(): Promise<Project[]> {
    try {
      const { supabase } = useSupabaseConnection();
  
      const { data: projectsData, error: projectsError } = await supabase
        .from('Projects')
        .select('id, project_name, project_img')
        .order('project_name', { ascending: true });
  
      if (projectsError) throw projectsError;
  
      return projectsData.map((project: any) => ({
        projectId: project.id,
        projectName: project.project_name,
        projectImage: project.project_img,
      })) as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }