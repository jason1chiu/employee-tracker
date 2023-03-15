// Import the inquirer package
const inquirer = require('inquirer');
// Import the console.table package
const cTable = require('console.table');

// Define a function called viewEmployeesByDepartment that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewEmployeesByDepartment = (db, promptUser) => {
  // Create a SQL statement to select all employees, their corresponding job titles, departments, salaries, and manager names from a specific department
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
              FROM employees e 
              LEFT JOIN roles r ON e.role_id = r.id 
              LEFT JOIN departments d ON r.department_id = d.id 
              LEFT JOIN employees m ON e.manager_id = m.id 
              WHERE d.name = ?`;

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
          message: 'Which department would you like to view?',
          choices: departmentList
        }
      ]);
    })
    .then(answers => {
      // Execute the SQL statement with the selected department name to retrieve all employees, their corresponding job titles, departments, salaries, and manager names from that department
      return db.promise().query(sql, [answers.department]);
    })
    .then(([results]) => {
      // Log the results to the console in a table format using console.table
      console.log("\n-----------------------------------------\n");
      console.table(results);
      console.log("\n-----------------------------------------\n");
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch(err => {
      console.log(err);
      promptUser();
    });
};

// Export the viewEmployeesByDepartment function so it can be used in other modules
module.exports = { viewEmployeesByDepartment };