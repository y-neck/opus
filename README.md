# Opus

As a student, you have to work on many projects as a team. Normally, many different tools are used to manage projects, and it can be difficult to keep track of all the tasks and deadlines. Opus is a project management tool that helps you keep track of your projects and tasks in that it tries to unite as many tools as possible in one place.

When you create a new project, you can add team members and invite them to the project. You can also assign tasks to team members and set deadlines for them. Opus will then display all the tasks assigned to you and the team members in a clear and organized way. Add links to important documents and files hosted on different platforms. Supabase will take care of the database and you can access it via the web application.

Developed 2024ff. by [Kevin Schärer](https://github.com/kevinschaerer) and [Yannick Spriessler](https://github.com/y-neck) as term project for the course "Major Media Applications" at the University of Applied Sciences of the Grisons, Switzerland.

Software: Nuxt3 + Supabase

## Features

- [x] Manage your different projects and team members
- [x] Create and assign tasks to team members
- [x] Set deadlines for tasks
- [x] Get an overview of all your tasks across projects
- [x] Manage links to all your files on different platforms
- [x] Install as web application on your device
- [ ] Chat with your team members
- [ ] Receive project updates and invites directly in your inbox
- [ ] Track project progress with a timeline

|   |   |   |
|---|---|---|
| Authentication | Only logged-in users can access the tool and the respective projects | Critical |
| Document management | Users can link important documents hosted on different platforms for the project | Critical |
| Task management | Users can create new tasks and assign them to different team members | Critical |
| Project member management | Each team has the option of inviting new team members invite or remove team members | Critical |
| Evaluation regarding equal distribution of work among group members | A graphic can be used to display the proportion of the total amount of tasks assigned to each team member | Nice-To-Have |
| Countdown display | A countdown displays the leftover days for the assignment's due date | Nice-To-Have |
| Sitemap for documents overview | The documents can be displayed via a sitemap for a clearer presentation | Nice-To-Have |
| Chat | The team can communicate with each other via a chat function | Nice-To-Have / Out-Of-Focus |
| PWA | The platform can be installed as a browser app on devices | Nice-To-Have / Out-Of-Focus |

## Contribution

You are welcome to contribute to this project. Please clone the repository and submit your changes as pull requests. If you have any problems or questions, please open an issue.
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Known Issues

Information: This project is still in development and might still have some issues. Please report any issues you encounter.

- [ ] Updating the profile image does not reflect visually, although the database is updated

## Learnings

- Calculate enough time for production testings
- The Project was too big for the assigned project scope
- Structure: The potential of a component-based architecture was not fully used
+ First project in vue/Nuxt
+ Supabase could be used to implement all required database functionalities
+ TailwindCSS: faster development and easier styling than with plain CSS
+ Database structure: was created beforehand and only needed small adjustments