// import required modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const express = require('express');

// import helper functions
const { viewAllDepartments } = require('./helper/viewAllDepartments');
const { viewAllRoles } = require('./helper/viewAllRoles');
const { viewAllEmployees } = require('./helper/viewAllEmployees');
const { addDepartment } = require('./helper/addDepartment');
const { addRole } = require('./helper/addRole');
const { addEmployee } = require('./helper/addEmployee');
const { updateEmployeeRole } = require('./helper/updateEmployeeRole');
const { updateEmployeeManager } = require('./helper/updateEmployeeManager');
const { viewEmployeesByDepartment } = require('./helper/viewEmployeesByDepartment');
const { viewEmployeesByManager } = require('./helper/viewEmployeesByManager');
const { deleteDepartment } = require('./helper/deleteDepartment');
const { deleteRole } = require('./helper/deleteRole');
const { deleteEmployee } = require('./helper/deleteEmployee');
const { viewDepartmentBudget } = require('./helper/viewDepartmentBudget');

// set port and create express app
const PORT = process.env.PORT || 3001;
const app = express();

// set up middleware for handling url encoded and json data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// create connection to MySQL database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employees_db',
  }
);

// prompt user for action to perform
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
        'Add a department',
        'Add a role',
        'Add an employee',
        "Update an employee's role",
        "Update an employee's manager",
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View the total budget of a department',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'Add a department':
        addDepartment(db, promptUser);
        break;
      case 'Add an employee':
        addEmployee(db, promptUser);
        break;
      case 'Add a role':
        addRole(db, promptUser);
        break;
      case 'Delete a department':
        deleteDepartment(db, promptUser);
        break;
      case 'Delete an employee':
        deleteEmployee(db, promptUser);
        break;
      case 'Delete a role':
        deleteRole(db, promptUser);
        break;
      case "Update an employee's role":
        updateEmployeeRole(db, promptUser);
        break;
      case "Update an employee's manager":
        updateEmployeeManager(db, promptUser);
        break;
      case 'View all departments':
        viewAllDepartments(db, promptUser);
        break;
      case 'View all roles':
        viewAllRoles(db, promptUser);
        break;
      case 'View all employees':
        viewAllEmployees(db, promptUser);
        break;
      case 'View employees by department':
        viewEmployeesByDepartment(db, promptUser);
        break;        
      case 'View employees by manager':
        viewEmployeesByManager(db, promptUser);
        break;        
      case 'View the total budget of a department':
        viewDepartmentBudget(db, promptUser);
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