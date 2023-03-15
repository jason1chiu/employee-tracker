// Define a function called viewAllRoles that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const viewAllRoles = (db, promptUser) => {
  // Create a SQL statement to select all roles from the database
  const sql = `SELECT * FROM roles`;
  // Execute the SQL statement to retrieve all roles from the database
  db.promise().query(sql)
    .then(([rows]) => {
      // Log the results to the console in a table format using console.table
      console.log("\n-----------------------------------------\n");
      console.table(rows);
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
    .catch((err) => {
      console.log(err);
      promptUser();
    });
};

// Export the viewAllRoles function so it can be used in other modules
module.exports = { viewAllRoles };