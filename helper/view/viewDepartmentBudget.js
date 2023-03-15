// Import the inquirer package
const inquirer = require('inquirer');

// Define a function called viewDepartmentBudget that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewDepartmentBudget = (db, promptUser) => {
  // Create a SQL statement to select the total budget of a department based on the sum of all salaries of employees in that department
  const sql = `SELECT d.name AS department, SUM(r.salary) AS total_budget
              FROM roles r
              INNER JOIN departments d ON r.department_id = d.id
              INNER JOIN employees e ON r.id = e.role_id
              WHERE d.name = ?
              GROUP BY d.name`;

  // Initialize an empty array to hold the list of department names
  const departmentList = [];

  // Retrieve the list of departments from the database and populate the departmentList array with their names
  db.promise().query(`SELECT * FROM departments`)
    .then(([departments]) => {
      departmentList.push(...departments.map(department => department.name));

      // Prompt the user to select a department from the departmentList array
      return inquirer.prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Which department would you like to view the budget for?',
          choices: departmentList
        }
      ]);
    })
    .then(answers => {
      // Execute the SQL statement with the selected department name to retrieve the total budget for that department
      return db.promise().query(sql, [answers.department]);
    })
    .then(([results]) => {
      // Log the results to the console in a table format using console.table
      console.log("\n-----------------------------------------\n");
      console.table(results);
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch(err => {
      console.error(err);
      promptUser();
    });
}

// Export the viewDepartmentBudget function so it can be used in other modules
module.exports = { viewDepartmentBudget };