const inquirer = require('inquirer');
const cTable = require('console.table');

const viewEmployeesByManager = (db, promptUser) => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
              FROM employees e 
              LEFT JOIN roles r ON e.role_id = r.id 
              LEFT JOIN departments d ON r.department_id = d.id 
              LEFT JOIN employees m ON e.manager_id = m.id 
              WHERE CONCAT(m.first_name, ' ', m.last_name) = ?`;

  const managerList = [];

  db.query(`SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e JOIN employees m ON m.id = e.manager_id ORDER BY manager_name`, (err, managers) => {
    if (err) throw err;
    managerList.push(...managers.map(manager => manager.manager_name));

    inquirer.prompt([
      {
        type: 'list',
        name: 'managerName',
        message: 'Which manager would you like to view?',
        choices: managerList
      }
    ]).then(answers => {
      db.query(sql, [answers.managerName], (err, results) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.table(results);
        promptUser();
      });
    });
  });
}

module.exports = { viewEmployeesByManager };