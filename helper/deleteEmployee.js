// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called deleteEmployee that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const deleteEmployee = (db, promptUser) => {
  // Create a SQL statement to delete an employee from the database using an employee ID as a parameter
  const sql = `DELETE FROM employees WHERE id = ?`;
  // Create an empty array to store the list of employees
  const employeeList = [];

  // Retrieve the list of employees from the database
  db.query(`SELECT * FROM employees`, (err, employees) => {
    if (err) throw err;

    // Add each employee's full name to the employeeList array
    employeeList.push(...employees.map(employee => `${employee.first_name} ${employee.last_name}`));

    // Use inquirer to prompt the user to choose an employee to delete
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to delete?',
        choices: employeeList
      }
    ]).then(answers => {
      // Find the selected employee in the employees array by their full name
      const selectedEmployee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee);
      // Execute the SQL statement with the selected employee's ID as a parameter to delete the employee from the database
      db.query(sql, [selectedEmployee.id], (err, result) => {
        if (err) throw err;
        // Log a message to the console confirming the deletion
        console.log("\n-----------------------------------------\n");
        console.log(`${answers.employee} has been deleted.`);
        console.log("\n-----------------------------------------\n");
        // Call the promptUser function to prompt the user for more actions
        promptUser();
      });
    });
  });
}

// Export the deleteEmployee function so it can be used in other modules
module.exports = { deleteEmployee };