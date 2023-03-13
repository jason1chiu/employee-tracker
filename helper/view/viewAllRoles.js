// Define a function called viewAllRoles that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewAllRoles = (db, promptUser) => {
  // Create a SQL statement to select all roles, their corresponding departments, and salaries from the database
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`;
  // Execute the SQL statement to retrieve all roles, their corresponding departments, and salaries from the database
  db.query(sql, (err, results) => {
    if (err) throw err;
    // Log the results to the console in a table format using console.table
    console.log("\n-----------------------------------------\n");
    console.table(results);
    // Call the promptUser function to prompt the user for more actions
    promptUser();
  });
};

// Export the viewAllRoles function so it can be used in other modules
module.exports = { viewAllRoles };