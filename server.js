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

viewAllDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
}

viewAllRoles = () => {
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, function (err, results) {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
}

viewAllEmployees = () => {
  const sql = `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id`;
  db.query(sql, function (err, results) {
    if (err) throw err;
    console.log("\n-----------------------------------------\n");
    console.table(results);
    promptUser();
  });
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});