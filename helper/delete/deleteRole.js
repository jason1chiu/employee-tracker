// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called deleteRole that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const deleteRole = async (db, promptUser) => {
  // Create a SQL statement to delete a role from the database using a role ID as a parameter
  const sql = `DELETE FROM roles WHERE id = ?`;
  // Create an empty array to store the list of roles
  const roleList = [];

  try {
    // Retrieve the list of roles from the database using MySQL2 .promise() function
    const [roles] = await db.promise().query(`SELECT * FROM roles`);
    // Add each role's title to the roleList array
    roles.forEach(role => {
      roleList.push(role.title);
    });

    // Use inquirer to prompt the user to choose a role to delete
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to delete?',
        choices: roleList
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete this role?',
        default: false
      }
    ]);

    // Find the selected role in the roles array by its title, and get its ID
    const roleId = roles.find(role => role.title === answers.role).id;

    if (answers.confirm) {
      // Execute the SQL statement with the selected role's ID as a parameter to delete the role from the database using MySQL2 .promise() function
      await db.promise().query(sql, [roleId]);
      // Log a message to the console confirming the deletion
      console.log("\n-----------------------------------------\n");
      console.log(`Role "${answers.role}" has been deleted.`);
      console.log("\n-----------------------------------------\n");
    }
  } catch (err) {
    console.log(err);
  } finally {
    // Call the promptUser function to prompt the user for more actions
    promptUser();
  }
};

// Export the deleteRole function so it can be used in other modules
module.exports = { deleteRole };