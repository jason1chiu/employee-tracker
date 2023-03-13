const inquirer = require('inquirer');
const consoleTable = require('console.table');

const viewEmployeesByDepartment = (db, promptUser) => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
              FROM employees e 
              LEFT JOIN roles r ON e.role_id = r.id 
              LEFT JOIN departments d ON r.department_id = d.id 
              LEFT JOIN employees m ON e.manager_id = m.id 
              WHERE d.name = ?`;

  const departmentList = [];

  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) {
      console.log(err);
      return;
    }

    departmentList.push(...departments.map(department => department.name));

    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to view?',
        choices: departmentList
      }
    ]).then(answers => {
      db.query(sql, [answers.department], (err, results) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log("\n-----------------------------------------\n");
        console.table(results);
        console.log("\n-----------------------------------------\n");
        promptUser();
      });
    });
  });
};

module.exports = { viewEmployeesByDepartment };