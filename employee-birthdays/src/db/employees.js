const db = require('./index');

const insertStmt = db.prepare(`
  INSERT INTO employees (first_name, last_name, email, birth_date, updated_at)
  VALUES (@firstName, @lastName, @email, @birthDate, datetime('now'))
`);

const updateStmt = db.prepare(`
  UPDATE employees
  SET first_name = @firstName,
      last_name = @lastName,
      email = @email,
      birth_date = @birthDate,
      updated_at = datetime('now')
  WHERE id = @id
`);

const deleteStmt = db.prepare(`DELETE FROM employees WHERE id = ?`);
const getStmt = db.prepare(`SELECT * FROM employees WHERE id = ?`);
const listStmt = db.prepare(`
  SELECT * FROM employees
  ORDER BY strftime('%m-%d', birth_date), last_name, first_name
`);

function list() {
  return listStmt.all();
}

function get(id) {
  return getStmt.get(id);
}

function create({ firstName, lastName, email, birthDate }) {
  const info = insertStmt.run({ firstName, lastName, email, birthDate });
  return get(info.lastInsertRowid);
}

function update(id, { firstName, lastName, email, birthDate }) {
  updateStmt.run({ id, firstName, lastName, email, birthDate });
  return get(id);
}

function remove(id) {
  deleteStmt.run(id);
}

module.exports = { list, get, create, update, remove };
