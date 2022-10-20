import { app } from 'electron';
import path from 'path';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const MIGRATION_PATH = `${RESOURCES_PATH}/migration`;

const DB_EMPTY_PATH = `${RESOURCES_PATH}/dbEmpty.sqlite3`;

const DB_PATH = app.isPackaged
  ? `${RESOURCES_PATH}/db.sqlite3`
  : `${RESOURCES_PATH}/dbDebug.sqlite3`;

export { RESOURCES_PATH, MIGRATION_PATH, DB_EMPTY_PATH, DB_PATH };
