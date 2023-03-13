// Require the inquirer package to prompt the user for input
const inquirer = require('inquirer');

// Define a function called deleteDepartment that takes two arguments: db (database connection object) and promptUser (a function to prompt the user for more actions)
const deleteDepartment = (db, promptUser) => {
  // Create a SQL statement to delete a department from the database using a department ID as a parameter
  const sql = `DELETE FROM departments WHERE id = ?`;

  // Retrieve the list of departments from the database to allow the user to choose one to delete
  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) throw err;

    // Use inquirer to prompt the user to choose a department to delete and confirm their decision
    inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department would you like to delete?',
        choices: departments.map(department => {
          return {
            name: department.name,
            value: department.id
          }
        })
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: 'Are you sure you want to delete this department and all of its associated roles and employees? This action cannot be undone.',
        default: false
      }
    ]).then(answers => {
      if (answers.confirmDelete) {
        // If the user confirms the delete action, execute the SQL statement with the chosen department ID as a parameter to delete the department from the database
        db.query(sql, [answers.departmentId], (err, result) => {
          if (err) throw err;
          // Log a message to the console confirming the deletion
          console.log("\n-----------------------------------------\n");
          console.log(`Department with ID ${answers.departmentId} has been deleted.`);
          console.log("\n-----------------------------------------\n");
          // Call the promptUser function to prompt the user for more actions
          promptUser();
        });
      } else {
        // If the user cancels the delete action, call the promptUser function to prompt the user for more actions
        promptUser();
      }
    });
  });
}

// Export the deleteDepartment function so it can be used in other modules
module.exports = { deleteDepartment };