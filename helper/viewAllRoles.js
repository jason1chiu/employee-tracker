const viewAllRoles = (db, promptUser) => {
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
};

module.exports = { viewAllRoles };