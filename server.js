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
        const { viewAllDepartments } = require('./helper/viewAllDepartments');
        viewAllDepartments(db, promptUser);
        break;
      case 'View all roles':
        const { viewAllRoles } = require('./helper/viewAllRoles');
        viewAllRoles(db, promptUser);
        break;
      case 'View all employees':
        const { viewAllEmployees } = require('./helper/viewAllEmployees');
        viewAllEmployees(db, promptUser);
        break;
      case 'Add a department':
        const { addDepartment } = require('./helper/addDepartment');
        addDepartment(db, promptUser);
        break;
      case 'Add a role':
        const { addRole } = require('./helper/addRole');
        addRole(db, promptUser);
        break;
      case 'Add an employee':
        const { addEmployee } = require('./helper/addEmployee');
        addEmployee(db, promptUser);
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

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});