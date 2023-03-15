// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called updateEmployeeRole that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const updateEmployeeRole = (db, promptUser) => {
  // Create a SQL statement to select the employees and their current roles from the database
  const sql = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.id AS role_id, r.title AS role_title
    FROM employees e
    LEFT JOIN roles r ON e.role_id = r.id
  `;

  // Execute the SQL statement to retrieve the list of employees and their current roles
  db.promise().query(sql)
    .then(([results, fields]) => {
      // Filter out any null roles
      const roles = results.filter(result => result.role_id !== null);

      // Use inquirer to prompt the user to choose an employee to update and select a new role for them
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
      // Create a SQL statement to update the employee's role in the database using the chosen employee ID and new role ID as parameters
      const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
      // Execute the SQL statement with the chosen employee ID and new role ID as parameters to update the employee's role in the database
      return db.promise().query(sql, [answers.roleId, answers.employeeId]);
    })
    .then(() => {
      // Log a message to the console confirming the update
      console.log("\n-----------------------------------------\n");
      console.log(`Employee with ID ${answers.employeeId} has been updated with new role ID ${answers.roleId}.`);
      console.log("\n-----------------------------------------\n");
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch(err => {
      console.log(err);
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    });
}

// Export the updateEmployeeRole function so it can be used in other modules
module.exports = { updateEmployeeRole };