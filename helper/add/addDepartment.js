// Import the inquirer library
const inquirer = require('inquirer');

// Import the MySQL2 package
const mysql = require('mysql2');

// Define the function to delete a department from the database
const addDepartment = async (db, promptUser) => {

  // Prompt user to enter information for new department
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:',

      // Validate that input is not empty
      validate: function (input) {
        if (input.trim() === '') {
          return 'Please enter a department name.';
        }
        return true;
      }
    }
  ]);

  // Create SQL query string to delete department with a specific ID
  const sql = `INSERT INTO departments (name) VALUES (?)`;

  try {
    // Execute the SQL statement with the user's input as a parameter
    const [results] = await db.promise().query(sql, [answers.name]);

    // Log a message to the console with the name of the new department and its corresponding ID
    console.log("\n-----------------------------------------\n");
    console.log(`${answers.name} department has been added with ID ${results.insertId}.`);
  } catch (err) {
    // If there is an error, throw it
    throw err;
  }

  // Call the promptUser function to prompt the user for more actions
  promptUser();
};

// Export the addDepartment function so it can be used in other modules
module.exports = { addDepartment };