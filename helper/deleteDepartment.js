const inquirer = require('inquirer');

const deleteDepartment = (db, promptUser) => {
  const sql = `DELETE FROM departments WHERE id = ?`;

  // retrieve the list of departments to allow user to choose one
  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) throw err;

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
        db.query(sql, [answers.departmentId], (err, result) => {
          if (err) throw err;
          console.log("\n-----------------------------------------\n");
          console.log(`Department with ID ${answers.departmentId} has been deleted.`);
          console.log("\n-----------------------------------------\n");
          promptUser();
        });
      } else {
        promptUser();
      }
    });
  });
}

module.exports = { deleteDepartment };