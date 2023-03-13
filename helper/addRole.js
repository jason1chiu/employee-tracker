const inquirer = require('inquirer');

const addRole = (db, promptUser) => {
  const departmentChoices = [];
  db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
      rows.forEach(row => {
        departmentChoices.push({name: row.name, value: row.id});
      });
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the name of the new role:',
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
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(sql, [answers.title, answers.salary, answers.department], function (err, result) {
          if (err) throw err;
          console.log("\n-----------------------------------------\n");
          console.log(`${answers.title} role has been added with ID ${result.insertId}.`);
          console.log("\n-----------------------------------------\n");
          promptUser();
        });
      });
    })
    .catch(err => {
      console.log(err);
      promptUser();
    });
};

module.exports = { addRole };