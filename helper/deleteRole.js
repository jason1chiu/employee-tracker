// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called deleteRole that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const deleteRole = (db, promptUser) => {
  // Create a SQL statement to delete a role from the database using a role ID as a parameter
  const sql = `DELETE FROM roles WHERE id = ?`;
  // Create an empty array to store the list of roles
  const roleList = [];

  // Retrieve the list of roles from the database
  db.query(`SELECT * FROM roles`, (err, roles) => {
    if (err) throw err;
    // Add each role's title to the roleList array
    roleList.push(...roles.map(role => role.title));

    // Use inquirer to prompt the user to choose a role to delete
    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to delete?',
        choices: roleList
      }
    ]).then(answers => {
      // Find the selected role in the roles array by its title, and get its ID
      const roleId = roles.find(role => role.title === answers.role).id;

      // Execute the SQL statement with the selected role's ID as a parameter to delete the role from the database
      db.query(sql, [roleId], (err, result) => {
        if (err) throw err;
        // Log a message to the console confirming the deletion
        console.log("\n-----------------------------------------\n");
        console.log(`Role "${answers.role}" has been deleted.`);
        console.log("\n-----------------------------------------\n");
        // Call the promptUser function to prompt the user for more actions
        promptUser();
      });
    });
  });
};

// Export the deleteRole function so it can be used in other modules
module.exports = { deleteRole };