import { Imovements, Iproject } from '../utils/DbInterface';

export default function sendAsync(sql) {
  return new Promise((resolve) => {
    window.electron.ipcRenderer.once('asynchronous-reply', (_, arg) => {
      resolve(_);
    });
    window.electron.ipcRenderer.sendMessage('asynchronous-message', sql);
  });
}

function getAllProjects() {
  return sendAsync(`SELECT *
                    FROM project_infos`);
}

function addProject(name: string, nominative_value: number, date: string) {
  const values = `'${name}','${nominative_value}','${date}'`;
  return sendAsync(`INSERT INTO projects(name, nominative_value, date)
                    VALUES (${values})`);
}

function editProject(project: Iproject) {
  return sendAsync(`UPDATE projects
                    SET name = '${project.name}',
                        nominative_value = '${project.value}',
                        date = '${project.date}'
                    WHERE id = ${project.id}`);
}

function removeProject(id: number) {
  return sendAsync(`DELETE
                    FROM projects
                    WHERE id = ${id};`);
}

function getMovementsByGroup(idProject: number) {
  return sendAsync(`SELECT *
                    FROM movements
                    where id_project = ${idProject}`);
}

function addMovement(movement: Imovements) {
  const values = `'${movement.value}','${movement.date}','${movement.description}','${movement.idProject}'`;
  return sendAsync(
    `INSERT INTO movements(value, date, description, id_project)
     VALUES (${values})`
  );
}

function editMovements(movement: Imovements) {
  return sendAsync(`UPDATE movements
                    SET description = '${movement.description}',
                        date        = '${movement.date}',
                        value       = '${movement.value}'
                    WHERE id = ${movement.id}`);
}

function removeMovement(id: number) {
  return sendAsync(`DELETE
                    FROM movements
                    WHERE id = ${id};`);
}

export {
  getAllProjects,
  addProject,
  editProject,
  removeProject,
  getMovementsByGroup,
  addMovement,
  editMovements,
  removeMovement,
};
