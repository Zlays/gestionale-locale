import { app } from 'electron';
import path from 'path';

const homedir = require('os').homedir();

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const MIGRATION_PATH = `${RESOURCES_PATH}/migration`;

const DB_EMPTY_PATH = `${RESOURCES_PATH}/dbEmpty.sqlite3`;

const DB_PATH = app.isPackaged
  ? `${homedir}/db.sqlite3`
  : `${homedir}/dbDebug.sqlite3`;

export { RESOURCES_PATH, MIGRATION_PATH, DB_EMPTY_PATH, DB_PATH, homedir };
