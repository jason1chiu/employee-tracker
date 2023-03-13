// Import the Inquirer.js library
const inquirer = require('inquirer');

// Define a function to add a new employee to the database
const addEmployee = (db, promptUser) => {

  // Initialize two arrays to hold the choices for the new employee's role and manager
  const roleChoices = [];
  const managerChoices = [{name: 'None', value: null}];

  // Query the database to get a list of all roles
  db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {

      // Loop through each row returned and add it to the roleChoices array
      rows.forEach(row => {
        roleChoices.push({name: row.title, value: row.id});
      });

      // Query the database to get a list of all employees, and add them to the managerChoices array
      db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees`)
        .then(([rows]) => {
          rows.forEach(row => {
            managerChoices.push({name: row.name, value: row.id});
          });

          // Use Inquirer to prompt the user for information about the new employee
          inquirer.prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter the first name of the new employee:',

              // Validate that the user has entered a first name
              validate: function (input) {
                if (input.trim() === '') {
                  return 'Please enter a first name.';
                }
                return true;
              }
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'Enter the last name of the new employee:',

              // Validate that the user has entered a last name
              validate: function (input) {
                if (input.trim() === '') {
                  return 'Please enter a last name.';
                }
                return true;
              }
            },
            {
              type: 'list',
              name: 'role',
              message: 'Select the role of the new employee:',
              choices: roleChoices
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Select the manager of the new employee:',
              choices: managerChoices
            }
          ]).then(answers => {

            // Construct a SQL query to add the new employee to the database
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

            // Execute the SQL query
            db.query(sql, [answers.first_name, answers.last_name, answers.role, answers.manager], function (err, result) {
              if (err) throw err;

              // Print a success message to the console
              console.log("\n-----------------------------------------\n");
              console.log(`${answers.first_name} ${answers.last_name} has been added with ID ${result.insertId}.`);
              console.log("\n-----------------------------------------\n");

              // Prompt the user for another action
              promptUser();
            });
          });
        })
        .catch(err => {
          console.log(err);

          // Prompt the user for another action
          promptUser();
        });
    })
    .catch(err => {
      console.log(err);
      
      // Prompt the user for another action
      promptUser();
    });
};

// Export the addEmployee function so that other modules can use it
module.exports = { addEmployee };