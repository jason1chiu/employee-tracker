const inquirer = require('inquirer');

const addDepartment = (db, promptUser) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:',
      validate: function (input) {
        if (input.trim() === '') {
          return 'Please enter a department name.';
        }
        return true;
      }
    }
  ]).then(answers => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    db.query(sql, [answers.name], function (err, result) {
      if (err) throw err;
      console.log("\n-----------------------------------------\n");
      console.log(`${answers.name} department has been added with ID ${result.insertId}.`);
      promptUser();
    })
  })
};

module.exports = { addDepartment };