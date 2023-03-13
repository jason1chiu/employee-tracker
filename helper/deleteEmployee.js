const inquirer = require('inquirer');

const deleteEmployee = (db, promptUser) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const employeeList = [];

  db.query(`SELECT * FROM employees`, (err, employees) => {
    if (err) throw err;
    employeeList.push(...employees.map(employee => `${employee.first_name} ${employee.last_name}`));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to delete?',
        choices: employeeList
      }
    ]).then(answers => {
      const selectedEmployee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee);
      db.query(sql, [selectedEmployee.id], (err, result) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.log(`${answers.employee} has been deleted.`);
        console.log("\n-----------------------------------------\n");
        promptUser();
      });
    });
  });
}

module.exports = { deleteEmployee };