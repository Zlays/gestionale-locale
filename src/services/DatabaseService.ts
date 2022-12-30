import fs from 'fs';
import { app, ipcMain } from 'electron';
import { DB_EMPTY_PATH, DB_PATH } from '../utils/Paths';

const sqlite3 = require('sqlite3');

function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.copyFile(DB_EMPTY_PATH, DB_PATH, (err) => {
      if (err) throw err;
    });

    console.log('Relaunch');
    app.relaunch();
  }

  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('Database opening error: ', err);
  });
}

const database = getDB();

ipcMain.on('db-query', (event, arg) => {
  const sql = arg[1];
  database.all(sql, (err, rows) => {
    event.reply(arg[0], (err && err.message) || rows);
  });
});

function dbClose() {
  database.close();
}

export { database, dbClose };
