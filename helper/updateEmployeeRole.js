const inquirer = require('inquirer');

const updateEmployeeRole = (db, promptUser) => {
  const sql = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.id AS role_id, r.title AS role_title
    FROM employees e
    LEFT JOIN roles r ON e.role_id = r.id
  `;

  db.query(sql, (err, results) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee you want to update:',
        choices: results.map(employee => {
          return {
            name: employee.employee_name,
            value: employee.id
          }
        })
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role for the employee:',
        choices: results.map(role => {
          return {
            name: `${role.role_title}`,
            value: role.role_id
          }
        })
      }
    ]).then(answers => {
      const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
      db.query(sql, [answers.roleId, answers.employeeId], function (err, result) {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.log(`Employee with ID ${answers.employeeId} has been updated with new role ID ${answers.roleId}.`);
        console.log("\n-----------------------------------------\n");
        promptUser();
      });
    });
  });
}

module.exports = { updateEmployeeRole };