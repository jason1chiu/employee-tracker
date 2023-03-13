// Import the inquirer package
const inquirer = require('inquirer');
// Import the console.table package
const cTable = require('console.table');

// Define a function called viewEmployeesByManager that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewEmployeesByManager = (db, promptUser) => {
  // Create a SQL statement to select all employees, their corresponding job titles, departments, salaries, and manager names from a specific manager
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
              FROM employees e 
              LEFT JOIN roles r ON e.role_id = r.id 
              LEFT JOIN departments d ON r.department_id = d.id 
              LEFT JOIN employees m ON e.manager_id = m.id 
              WHERE CONCAT(m.first_name, ' ', m.last_name) = ?`;

  // Initialize an empty array to hold the list of manager names
  const managerList = [];

  // Retrieve the list of managers from the database and populate the managerList array with their names
  db.query(`SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e JOIN employees m ON m.id = e.manager_id ORDER BY manager_name`, (err, managers) => {
    if (err) throw err;
    managerList.push(...managers.map(manager => manager.manager_name));

    // Prompt the user to select a manager from the managerList array
    inquirer.prompt([
      {
        type: 'list',
        name: 'managerName',
        message: 'Which manager would you like to view?',
        choices: managerList
      }
    ]).then(answers => {
      // Execute the SQL statement with the selected manager name to retrieve all employees, their corresponding job titles, departments, salaries, and manager names under that manager
      db.query(sql, [answers.managerName], (err, results) => {
        if (err) throw err;

        // Log the results to the console in a table format using console.table
        console.log("\n-----------------------------------------\n");
        console.table(results);
        // Call the promptUser function to prompt the user for more actions
        promptUser();
      });
    });
  });
}

// Export the viewEmployeesByManager function so it can be used in other modules
module.exports = { viewEmployeesByManager };