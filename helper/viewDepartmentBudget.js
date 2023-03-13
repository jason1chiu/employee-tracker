const inquirer = require('inquirer');

const viewDepartmentBudget = (db, promptUser) => {
  const sql = `SELECT d.name AS department, SUM(r.salary) AS total_budget
              FROM roles r
              INNER JOIN departments d ON r.department_id = d.id
              INNER JOIN employees e ON r.id = e.role_id
              WHERE d.name = ?
              GROUP BY d.name`;

  const departmentList = [];

  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) throw err;
    departmentList.push(...departments.map(department => department.name));

    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to view the budget for?',
        choices: departmentList
      }
    ]).then(answers => {
      db.query(sql, [answers.department], (err, results) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.table(results);
        promptUser();
      });
    });
  });
}

module.exports = { viewDepartmentBudget };