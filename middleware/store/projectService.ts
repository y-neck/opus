// Define Interface
interface Project {
    projectId: string | number;
    projectName: string;
    projectIcon: string;
  }
  
  // Fetch projects from the database
export async function getProjects(): Promise<Project[]> {
  try {
    const { supabase } = useSupabaseConnection();
  
    const { data: projectsData, error: projectsError } = await supabase
      .from('Projects')
      .select('id, project_name, icon, created_by')
      .order('project_name', { ascending: true });

    if (projectsError) throw projectsError;

    return projectsData.map((project: any) => ({
      projectId: project.id,
      projectName: project.project_name,
      projectIcon: project.icon,
      createdBy: project.created_by,
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}