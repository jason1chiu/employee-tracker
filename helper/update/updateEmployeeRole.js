// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called updateEmployeeRole that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const updateEmployeeRole = (db, promptUser) => {
  const sql = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.id AS role_id, r.title AS role_title
    FROM employees e
    LEFT JOIN roles r ON e.role_id = r.id
  `;

  db.promise().query(sql)
    .then(([results, fields]) => {
      const roles = results.filter(result => result.role_id !== null);

      return inquirer.prompt([
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
          choices: roles.map(role => {
            return {
              name: `${role.role_title}`,
              value: role.role_id
            }
          })
        }
      ]);
    })
    .then(answers => {
      const employeeId = answers.employeeId;
      const roleId = answers.roleId;
      const updateSql = `UPDATE employees SET role_id = ? WHERE id = ?`;
      const selectSql = `
        SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.id AS role_id, r.title AS role_title
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        WHERE e.id = ?
      `;

      return db.promise().execute(updateSql, [roleId, employeeId])
        .then(() => {
          return db.promise().execute(selectSql, [employeeId]);
        });
    })
    .then(([results, fields]) => {
      console.log("\n-----------------------------------------\n");
      console.log(`Employee's role has been updated.`);
      console.table(results);
      console.log("\n-----------------------------------------\n");
      promptUser();
    })
    .catch(err => {
      console.log(err);
      promptUser();
    });
}

// Export the updateEmployeeRole function so it can be used in other modules
module.exports = { updateEmployeeRole };