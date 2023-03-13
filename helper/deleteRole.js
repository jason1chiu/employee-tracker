const inquirer = require('inquirer');

const deleteRole = (db, promptUser) => {
  const sql = `DELETE FROM roles WHERE id = ?`;
  const roleList = [];

  db.query(`SELECT * FROM roles`, (err, roles) => {
    if (err) throw err;
    roleList.push(...roles.map(role => role.title));

    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to delete?',
        choices: roleList
      }
    ]).then(answers => {
      const roleId = roles.find(role => role.title === answers.role).id;

      db.query(sql, [roleId], (err, result) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.log(`Role "${answers.role}" has been deleted.`);
        console.log("\n-----------------------------------------\n");
        promptUser();
      });
    });
  });
};

module.exports = { deleteRole };