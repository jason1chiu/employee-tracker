// Import the inquirer package
const inquirer = require('inquirer');

// Define a function called updateEmployeeManager that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const updateEmployeeManager = (db, promptUser) => {
  // Create a SQL statement to select all employees from the database
  const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees`;

  // Retrieve the list of employees from the database
  db.query(sql, (err, employees) => {
    if (err) throw err;

    // Create an empty array to store the list of employee names
    const employeeNames = [];
    employeeNames.push(...employees.map(employee => ({ name: employee.name, value: employee.id })));

    // Prompt the user to select an employee to update the manager for
    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee would you like to update the manager for?',
        choices: employeeNames
      }
    ]).then(answers => {
      // Create a SQL statement to select all employees except the selected employee from the database
      const excludeEmployeeSql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE id != ?`;

      // Retrieve the list of managers to choose from, including null
      db.query(excludeEmployeeSql, [answers.employeeId], (err, managers) => {
        if (err) throw err;

        // Add null as an option for managers to choose from
        const managerList = [{ name: 'None', value: null }];
        managerList.push(...managers.map(manager => ({ name: manager.name, value: manager.id })));

        // Prompt the user to select a new manager for the employee
        inquirer.prompt([
          {
            type: 'list',
            name: 'managerId',
            message: 'Which manager would you like to set for this employee?',
            choices: managerList
          }
        ]).then(updateAnswers => {
          // Update the employee's manager in the database
          db.query(`UPDATE employees SET manager_id = ? WHERE id = ?`, [updateAnswers.managerId, answers.employeeId], (err, result) => {
            if (err) throw err;

            // Log a message to the console confirming the update
            console.log("\n-----------------------------------------\n");
            console.log(`Employee's manager has been updated.`);
            console.log("\n-----------------------------------------\n");

            // Call the promptUser function to prompt the user for more actions
            promptUser();
          });
        });
      });
    });
  });
};

// Export the updateEmployeeManager function so it can be used in other modules
module.exports = { updateEmployeeManager };