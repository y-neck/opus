// Placeholder tasks
const projectTasks: TaskModel[] = [
  {
    projectId: 1,
    projectName: 'Urban Wildlife',
    taskSections: [
      {
        index: 0, // Add index value
        name: 'section1',
        tasks: [
          {
            id: 1,
            name: 'task1',
            dueDate: {
              day: 25,
              month: 3,
              year: 4989,
            },
            assignedTo: [{ id: 1, name: 'member1' }],
          },
        ],
      },
      {
        index: 1, // Add index value
        name: 'section2',
        tasks: [
          {
            id: 2,
            name: 'task2',
            dueDate: {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
            assignedTo: [],
          },
          {
            id: 3,
            name: 'task3',
            dueDate: {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
            assignedTo: [],
          },
        ],
      },
    ],
    projectMembers: [
      { id: 1, name: 'member1' },
      { id: 2, name: 'member2' },
    ],
  },
  {
    projectId: 2,
    projectName: 'Campus Navigation',
    taskSections: [
      {
        index: 0, // Add index value
        name: 'section3',
        tasks: [
          {
            id: 4,
            name: 'task4',
            dueDate: {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
            assignedTo: [] as { id: number; name: string }[],
          },
          {
            id: 5,
            name: 'task5',
            dueDate: {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
            assignedTo: [],
          },
        ],
      },
    ],
    projectMembers: [{ id: 3, name: 'member3' }],
  },
];
/* TODO: Replace with actual data from DB */

export default projectTasks;

export interface TaskModel {
  projectId: number;
  projectName: string;
  taskSections: {
    index: number; // Add index property
    name: string;
    tasks: {
      id: number;
      name: string;
      dueDate: {
        day: number;
        month: number;
        year: number;
      };
      assignedTo: { id: number; name: string }[];
    }[];
  }[];
  projectMembers: { id: number; name: string }[];
}
