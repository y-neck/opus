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

    // FIXME: Name not properly assigned to member
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
    const projects = await Promise.all(
      projectsData.map(async (project: any) => ({
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
        taskSections: await Promise.all(
          sectionsData
            .filter((section: any) => section.project_id === project.id)
            .map(async (section: any) => ({
              index: section.id,
              name: section.section_name,

              // Map tasks assigned to each section
              tasks: await Promise.all(
                tasksData
                  // Filter tasks that belong to the current section by checking if tasks_section matches the section ID
                  .filter((task: any) => task.tasks_section === section.id)
                  // Map through each filtered task and process it asynchronously
                  .map(async (task: any) => {
                    // Parse `assigned_to` as an array of IDs
                    // Check if `assigned_to` is already an array; if not, split by commas to get individual IDs
                    const assignedToIds = Array.isArray(task.assigned_to)
                      ? task.assigned_to
                      : typeof task.assigned_to === 'string'
                      ? task.assigned_to
                          .split(',')
                          .map((id: string) => parseInt(id.trim(), 10))
                      : [];

                    // Fetch profiles for each assigned member by mapping through assignedToIds
                    // Promise.all ensures all profile fetches happen in parallel
                    const assignedMembers: ProjectMember[] = await Promise.all(
                      assignedToIds.map(async (assignedId: number) => {
                        // Fetch the profile for the assigned member by user ID
                        const { data: profileData, error } =
                          await supabaseConnection()
                            .supabase.from('Profiles')
                            .select('id, name, surname')
                            .eq('id', assignedId)
                            .single();

                        // Handle cases where profile data may not be found
                        if (error) {
                          console.warn(
                            `Profile not found for ID ${assignedId}`
                          );
                          return {
                            id: assignedId,
                            name: 'Unknown', // Set default name if profile is missing
                            role: 'Unknown', // Set default role if profile is missing
                          };
                        }

                        // Find the member's role from `membersData` using user ID, falling back to 'Unknown' if role is missing
                        const memberRole = membersData.find(
                          (member) => member.user_id === assignedId
                        )?.role;

                        return {
                          id: assignedId,
                          name: `${profileData?.name} ${profileData?.surname}`, // Format name and surname
                          role: memberRole || 'Unknown', // Assign role or fallback to 'Unknown'
                        };
                      })
                    );

                    // Return a task object with populated fields
                    return {
                      id: task.id,
                      name: task.name,
                      // Parse and format startDate if present
                      startDate: task.start_date
                        ? {
                            day: new Date(task.start_date).getDate(),
                            month: new Date(task.start_date).getMonth() + 1,
                            year: new Date(task.start_date).getFullYear(),
                          }
                        : undefined, // Leave undefined if no start date
                      // Parse and format dueDate if present
                      dueDate: task.due_date
                        ? {
                            day: new Date(task.due_date).getDate(),
                            month: new Date(task.due_date).getMonth() + 1,
                            year: new Date(task.due_date).getFullYear(),
                          }
                        : undefined, // Leave undefined if no due date
                      assignedTo: assignedMembers, // Assign fetched members list to assignedTo
                    };
                  })
              ),
              // Add tasks that are not assigned to any task section
            }))
          ),
          unsectionedTasks: await Promise.all(
            tasksData
          .filter(
            (task: any) =>
              task.projects_id === project.id && !task.tasks_section
          )
          .map(async (task: any) => ({
            id: task.id,
            name: task.name,
            startDate: task.start_date
              ? {
                  day: new Date(task.start_date).getDate(),
                  month: new Date(task.start_date).getMonth() + 1,
                  year: new Date(task.start_date).getFullYear(),
                }
              : undefined, // Leave undefined if no start date
            dueDate: task.due_date
              ? {
                  day: new Date(task.due_date).getDate(),
                  month: new Date(task.due_date).getMonth() + 1,
                  year: new Date(task.due_date).getFullYear(),
                }
              : undefined, // Leave undefined if no due date
            assignedTo: [], // Assign empty array to assignedTo
            status_id: task.status_id,
          }))
          )
      }))
    );

    return projects.map((project) => ({
      ...project,
      taskSections: project.taskSections.map((section) => ({
        ...section,
        tasks: section.tasks.map((task) => ({
          ...task,
        })) as Task[], // Ensure TypeScript treats this as a Task array
      })) as TaskSection[],
    })) as Project[];
  } catch (error) {
    console.error('Error assembling project data:', error);
    return [];
  }
}
