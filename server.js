const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employees_db',
  }
);

const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'View employees by manager',
        'View employees by department',
        'View the total budget of a department',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee"s role',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee"s role':
        updateEmployeeRole();
        break;
      case 'View employees by manager':
        viewEmployeesByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
        break;
      case 'Delete a department':
        deleteDepartment();
        break;
      case 'Delete a role':
        deleteRole();
        break;
      case 'Delete an employee':
        deleteEmployee();
        break;
      case 'View the total budget of a department':
        viewDepartmentBudget();
        break;
      case 'Exit':
        console.log('Goodbye!');
        db.end();
        return;
      default:
        console.log('Invalid option. Please try again.');
    }
  })
};

promptUser();

viewAllDepartments = async () => {
  const sql = `SELECT * FROM departments`;
  try {
    const [rows, fields] = await db.promise().query(sql);
    console.log("\n-----------------------------------------\n");
    console.table(rows);
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

viewAllRoles = async () => {
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`;
  try {
    const [rows, fields] = await db.promise().query(sql);
    console.log("\n-----------------------------------------\n");
    console.table(rows);
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

viewAllEmployees = async () => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id`;
  try {
    const [rows, fields] = await db.promise().query(sql);
    console.log("\n-----------------------------------------\n");
    console.table(rows);
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}


addDepartment = async () => {
  try {
    const answers = await inquirer.prompt([
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
    ]);
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const [result] = await db.promise().execute(sql, [answers.name]);
    console.log("\n-----------------------------------------\n");
    console.log(`${answers.name} department has been added with ID ${result.insertId}.`);
    console.log("\n-----------------------------------------\n");
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

addRole = async () => {
  try {
    const [rows, fields] = await db.promise().query(`SELECT * FROM departments`);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
        validate: function (input) {
          if (input.trim() === '') {
            return 'Please enter a role title.';
          }
          return true;
        }
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the new role:',
        validate: function (input) {
          if (isNaN(input) || input < 0) {
            return 'Please enter a positive number for the salary.';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the new role:',
        choices: rows.map(department => {
          return {
            name: department.name,
            value: department.id
          }
        })
      }
    ]);

    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
    const [result] = await db.promise().execute(sql, [answers.title, answers.salary, answers.departmentId]);
    console.log("\n-----------------------------------------\n");
    console.log(`${answers.title} role has been added with ID ${result.insertId}.`);
    console.log("\n-----------------------------------------\n");
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

addEmployee = async () => {
  try {
    const [rows, fields] = await db.promise().query(`
      SELECT r.id, r.title, r.salary, CONCAT(e.first_name, ' ', e.last_name) AS manager_name
      FROM roles r
      LEFT JOIN employees e ON r.id = e.role_id
    `);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the new employee:',
        validate: function (input) {
          if (input.trim() === '') {
            return 'Please enter the first name of the employee.';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the new employee:',
        validate: function (input) {
          if (input.trim() === '') {
            return 'Please enter the last name of the employee.';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the role for the new employee:',
        choices: rows.map(role => {
          return {
            name: `${role.title} (Salary: ${role.salary})`,
            value: role.id
          }
        })
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the manager for the new employee:',
        choices: [
          {
            name: 'None',
            value: null
          },
          ...rows.filter(role => role.manager_name !== null).map(role => {
            return {
              name: role.manager_name,
              value: role.id
            }
          })
        ]
      }
    ]);

    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const [result] = await db.promise().execute(sql, [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
    console.log("\n-----------------------------------------\n");
    console.log(`${answers.firstName} ${answers.lastName} has been added as a new employee with ID ${result.insertId}.`);
    console.log("\n-----------------------------------------\n");
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

updateEmployeeRole = async () => {
  try {
    const [rows, fields] = await db.promise().query(`
      SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.id AS role_id, r.title AS role_title
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
    `);

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee you want to update:',
        choices: rows.map(employee => {
          return {
            name: employee.employee_name,
            value: employee.id
          }
        })
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role for the employee:',
        choices: rows.map(role => {
          return {
            name: `${role.role_title}`,
            value: role.role_id
          }
        })
      }
    ]);

    const [result, _] = await db.promise().query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answers.roleId, answers.employeeId]);

    console.log("\n-----------------------------------------\n");
    console.log(`Employee with ID ${answers.employeeId} has been updated with new role ID ${answers.roleId}.`);
    console.log("\n-----------------------------------------\n");
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

viewEmployeesByManager = async () => {
  try {
    const [rows, fields] = await db.promise().query(`
      SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager_name, e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      JOIN departments d ON r.department_id = d.id
      JOIN employees m ON e.manager_id = m.id
    `);

    const managers = [...new Set(rows.map(employee => employee.manager_name))];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message: 'Select a manager to view their employees:',
        choices: managers
      }
    ]);

    const filteredResults = rows.filter(employee => employee.manager_name === answers.manager);
    console.log("\n-----------------------------------------\n");
    console.log(`Employees reporting to ${answers.manager}:`);
    console.table(filteredResults);
    console.log("\n-----------------------------------------\n");
    promptUser();
  } catch (err) {
    console.log(err);
    db.end();
  }
}

viewEmployeesByDepartment = () => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
              FROM employees e 
              LEFT JOIN roles r ON e.role_id = r.id 
              LEFT JOIN departments d ON r.department_id = d.id 
              LEFT JOIN employees m ON e.manager_id = m.id 
              WHERE d.name = ?`;
  const departmentList = [];

  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) throw err;
    departmentList.push(...departments.map(department => department.name));

    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to view?',
        choices: departmentList
      }
    ]).then(answers => {
      db.query(sql, [answers.department], (err, results) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.table(results);
        promptUser();
      });
    });
  });
}

deleteDepartment = () => {
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

deleteRole = () => {
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
}

deleteEmployee = () => {
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

viewDepartmentBudget = () => {
  const sql = `SELECT d.name AS department, SUM(r.salary) AS total_budget
              FROM roles r
              INNER JOIN departments d ON r.department_id = d.id
              INNER JOIN employees e ON r.id = e.role_id
              WHERE d.name = ?
              GROUP BY d.name`;

  const departmentList = [];

  db.query(`SELECT * FROM departments`, (err, departments) => {
    if (err) throw err;
    departmentList.push(...departments.map(department => department.name));

    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to view the budget for?',
        choices: departmentList
      }
    ]).then(answers => {
      db.query(sql, [answers.department], (err, results) => {
        if (err) throw err;
        console.log("\n-----------------------------------------\n");
        console.table(results);
        promptUser();
      });
    });
  });
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});