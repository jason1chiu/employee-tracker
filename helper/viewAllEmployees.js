const viewAllEmployees = (db, promptUser) => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
};

module.exports = { viewAllEmployees };