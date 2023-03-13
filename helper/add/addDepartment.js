// Import the inquirer library
const inquirer = require('inquirer');

// Define the function to delete a department from the database
const addDepartment = (db, promptUser) => {

  // Prompt user to enter information for new department
  inquirer.prompt([
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
  ]).then(answers => {
    // Create SQL query string to delete department with a specific ID
    const sql = `INSERT INTO departments (name) VALUES (?)`;

    // Execute the SQL statement with the user's input as a parameter
    db.query(sql, [answers.name], function (err, result) {

      // If there is an error, throw it
      if (err) throw err;

      // Log a message to the console with the name of the new department and its corresponding ID
      console.log("\n-----------------------------------------\n");
      console.log(`${answers.name} department has been added with ID ${result.insertId}.`);
      
      // Call the promptUser function to prompt the user for more actions
      promptUser();
    })
  })
};

// Export the addDepartment function so it can be used in other modules
module.exports = { addDepartment };