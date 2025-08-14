// update.js - Minimal update logic

function update(store, key, value) {
  if (store && typeof store === 'object') {
    store[key] = value;
    return true;
  }
  return false;
}

module.exports = {
  update
};
