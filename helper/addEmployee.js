const inquirer = require('inquirer');

const addEmployee = (db, promptUser) => {
  const roleChoices = [];
  const managerChoices = [{name: 'None', value: null}];
  db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {
      rows.forEach(row => {
        roleChoices.push({name: row.title, value: row.id});
      });
      db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees`)
        .then(([rows]) => {
          rows.forEach(row => {
            managerChoices.push({name: row.name, value: row.id});
          });
          inquirer.prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter the first name of the new employee:',
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
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.query(sql, [answers.first_name, answers.last_name, answers.role, answers.manager], function (err, result) {
              if (err) throw err;
              console.log("\n-----------------------------------------\n");
              console.log(`${answers.first_name} ${answers.last_name} has been added with ID ${result.insertId}.`);
              console.log("\n-----------------------------------------\n");
              promptUser();
            });
          });
        })
        .catch(err => {
          console.log(err);
          promptUser();
        });
    })
    .catch(err => {
      console.log(err);
      promptUser();
    });
};

module.exports = { addEmployee };