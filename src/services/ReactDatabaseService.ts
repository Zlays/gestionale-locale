import { Imovements, Iproject } from '../utils/DbInterface';

export default function sendAsync(channel: string, sql: string) {
  return new Promise((resolve) => {
    window.electron.ipcRenderer.once(channel, (_, arg) => {
      resolve(_);
    });
    window.electron.ipcRenderer.sendMessage(`db-query`, [channel, sql]);
  });
}

function getAllProjects() {
  return sendAsync(
    'getAllProjects',
    `SELECT *
                    FROM project_infos`
  );
}

function getProjectById(idProject: number) {
  const sqlScript = `SELECT *
                    FROM project_infos
                    WHERE id=${idProject} `;
  return sendAsync('getProjectById', sqlScript);
}

function addProject(
  name: string,
  nominative_value: number,
  startDate: string,
  endDate: string
) {
  const values = `'${name}','${nominative_value}','${startDate}','${endDate}'`;
  const sqlScript = `INSERT INTO projects(name, nominative_value, start_date, end_date)
                    VALUES (${values})`;
  return sendAsync('addProject', sqlScript);
}

function editProject(project: Iproject) {
  const sqlScript = `UPDATE projects
                    SET name = '${project.name}',
                        nominative_value = '${project.nominative_value}',
                        start_date = '${project.start_date}',
                        end_date = '${project.end_date}'
                    WHERE id = ${project.id}`;
  return sendAsync('editProject', sqlScript);
}

function removeProject(id: number) {
  return sendAsync(
    'removeProject',
    `DELETE
                    FROM projects
                    WHERE id = ${id};`
  );
}

function getMovementsByGroup(idProject: number) {
  return sendAsync(
    'getMovementsByGroup',
    `SELECT *
                    FROM movements
                    where id_project = ${idProject}`
  );
}

function addMovement(movement: Imovements) {
  const values = `'${movement.value}','${movement.date}','${movement.description}','${movement.idProject}','${movement.order}'`;
  const sqlScript = `INSERT INTO movements(value, date, description, id_project, 'order')
     VALUES (${values})`;
  return sendAsync('addMovement', sqlScript);
}

function editMovements(movement: Imovements) {
  return sendAsync(
    'editMovements',
    `UPDATE movements
                    SET description = '${movement.description}',
                        date        = '${movement.date}',
                        value       = '${movement.value}',
                        'order'       = '${movement.order}'
                    WHERE id = ${movement.id}`
  );
}

function removeMovement(id: number) {
  return sendAsync(
    'removeMovement',
    `DELETE
                    FROM movements
                    WHERE id = ${id};`
  );
}

export {
  getAllProjects,
  getProjectById,
  addProject,
  editProject,
  removeProject,
  getMovementsByGroup,
  addMovement,
  editMovements,
  removeMovement,
};
