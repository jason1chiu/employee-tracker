// Define a function called viewAllEmployees that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewAllEmployees = (db, promptUser) => {
  // Create a SQL statement to select all employees, their job titles, departments, salaries, and manager names from the database
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id`;

  // Execute the SQL statement to retrieve all employees, their job titles, departments, salaries, and manager names from the database
  db.promise().query(sql)
    .then(([rows, fields]) => {
      // Log the results to the console in a table format using console.table
      console.log("\n-----------------------------------------\n");
      console.table(rows);
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

// Export the viewAllEmployees function so it can be used in other modules
module.exports = { viewAllEmployees };