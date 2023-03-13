// Import inquirer library
const inquirer = require('inquirer');

// Define function to prompt user for new role information and add it to the database
const addRole = (db, promptUser) => {

  // Initialize empty array to hold department choices
  const departmentChoices = [];

  // Query the database to get all departments and push their name and id into departmentChoices array
  db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
      rows.forEach(row => {
        departmentChoices.push({name: row.name, value: row.id});
      });

      // Prompt user to enter information for new role
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the name of the new role:',

          // Validate that input is not empty
          validate: function (input) {
            if (input.trim() === '') {
              return 'Please enter a role name.';
            }
            return true;
          }
        },
        {
          type: 'number',
          name: 'salary',
          message: 'Enter the salary of the new role:',

          // Validate that input is a number greater than 0
          validate: function (input) {
            if (isNaN(input) || input <= 0) {
              return 'Please enter a valid salary greater than 0.';
            }
            return true;
          }
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department of the new role:',
          choices: departmentChoices
        }
      ]).then(answers => {
        // Create SQL query string to insert new role into database
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

        // Execute query with user's answers as parameters, and print success message with new role's ID
        db.query(sql, [answers.title, answers.salary, answers.department], function (err, result) {
          if (err) throw err;
          console.log("\n-----------------------------------------\n");
          console.log(`${answers.title} role has been added with ID ${result.insertId}.`);
          console.log("\n-----------------------------------------\n");

          // Prompt user again for main menu options
          promptUser();
        });
      });
    })
    .catch(err => {
      console.log(err);

      // Prompt user again for main menu options
      promptUser();
    });
};

// Export addRole function
module.exports = { addRole };
