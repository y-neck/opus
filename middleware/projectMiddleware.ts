// Fetch projects data from DB
import { supabaseConnection } from '~/composables/supabaseConnection';
import type {
  Project,
  ProjectMember,
  TaskSection,
  Task,
} from './models/projectsETL';

export async function getProjects(): Promise<Project[]> {
  // DEBUG:
  console.log('Testing supabaseConnection ', supabaseConnection());

  try {
    // Fetch Projects
    const { data: projectsData, error: projectsError } =
      await supabaseConnection()
        .supabase.from('Projects')
        .select('id, project_name, project_img');
    // DEBUG:
    console.log('ProjectsData: ', projectsData);
    if (projectsError) throw projectsError;

    // Fetch Project Members
    const { data: membersData, error: membersError } =
      await supabaseConnection()
        .supabase.from('Members')
        .select('id, project_id, user_id, role');
    // DEBUG:
    console.log('MembersData: ', membersData);
    if (membersError) throw membersError;

    // Fetch corresponding Profiles for Members
    const { data: memberNameData, error: memberNameError } =
      await supabaseConnection()
        .supabase.from('Profiles')
        .select('id, name, surname')
        .in('id', membersData.map((member) => member.user_id).filter(Boolean));
    if (memberNameError) throw memberNameError;
    // Create a map from user_id to the member's name and surname for easy lookup
    const memberNameMap = memberNameData.reduce((map, member) => {
      map[member.id] = `${member.name} ${member.surname}`;
      return map;
    }, {} as Record<number, string>);

    // Fetch Task Sections
    const { data: sectionsData, error: sectionsError } =
      await supabaseConnection()
        .supabase.from('Tasks_Sections')
        .select('id, project_id, section_name');
    // DEBUG:
    console.log('SectionsData: ', sectionsData);
    if (sectionsError) throw sectionsError;

    // Fetch Tasks and Assigned Members
    const { data: tasksData, error: tasksError } = await supabaseConnection()
      .supabase.from('Tasks')
      .select(
        'id, name, start_date, due_date, status_id, projects_id, assigned_to, tasks_section'
      );
    // DEBUG:
    console.log('TasksData: ', tasksData);
    if (tasksError) throw tasksError;
    // DEBUG:
    console.log('Project Data fetching successful');

    // Map data to Project interface
    return projectsData.map((project: any) => ({
      projectId: project.id,
      projectName: project.project_name,

      // Map members assigned to project
      projectMembers: membersData
        .filter((member: any) => member.project_id === project.id)
        .map((member: any) => ({
          id: member.user_id,
          name: memberNameMap[member.user_id] || 'Unknown', // Use map to find full name or 'Unknown' as fallback
          role: member.role,
        })) as ProjectMember[],

      // Map sections assigned to project
      taskSections: sectionsData
        .filter((section: any) => section.project_id === project.id)
        .map((section: any) => ({
          index: section.id,
          name: section.section_name,

          // Map tasks assigned to each section
          tasks: tasksData
            .filter((task: any) => task.tasks_section === section.id)
            .map((task: any) => ({
              id: task.id,
              name: task.name,
              startDate: task.start_date
                ? {
                    day: new Date(task.start_date).getDate(),
                    month: new Date(task.start_date).getMonth() + 1,
                    year: new Date(task.start_date).getFullYear(),
                  }
                : undefined,
              dueDate: task.due_date
                ? {
                    day: new Date(task.due_date).getDate(),
                    month: new Date(task.due_date).getMonth() + 1,
                    year: new Date(task.due_date).getFullYear(),
                  }
                : undefined,

              // Map assigned members to task
              assignedTo: task.assigned_to.map((assigned: any) => ({
                id: assigned.id,
                name: memberNameMap[assigned.id] || 'Unknown',
                role: assigned.role,
              })) as ProjectMember[],
            })) as Task[],
        })) as TaskSection[],
    })) as Project[];
  } catch (error) {
    console.error('Error assembling project data:', error);
    return [];
  }
}
