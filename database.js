// database.js - Minimal in-memory key-value database

const db = {};

function set(key, value) {
  db[key] = value;
}

function get(key) {
  return db[key];
}

function getAll() {
  return { ...db };
}

module.exports = {
  set,
  get,
  getAll
};
