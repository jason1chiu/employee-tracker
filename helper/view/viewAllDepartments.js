// Define a function called viewAllDepartments that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewAllDepartments = (db, promptUser) => {
  // Create a SQL statement to select all departments from the database
  const sql = `SELECT * FROM departments`;
  // Execute the SQL statement to retrieve all departments from the database
  db.promise().query(sql)
    .then(([rows, fields]) => {
      // Log the results to the console in a table format using console.table
      console.log("\n-----------------------------------------\n");
      console.table(rows);
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch(err => {
      throw err;
    });
};

// Export the viewAllDepartments function so it can be used in other modules
module.exports = { viewAllDepartments };