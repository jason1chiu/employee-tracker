// import required modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const express = require('express');

// import helper functions
const { viewAllDepartments } = require('./helper/view/viewAllDepartments');
const { viewAllRoles } = require('./helper/view/viewAllRoles');
const { viewAllEmployees } = require('./helper/view/viewAllEmployees');
const { addDepartment } = require('./helper/add/addDepartment');
const { addRole } = require('./helper/add/addRole');
const { addEmployee } = require('./helper/add/addEmployee');
const { updateEmployeeRole } = require('./helper/update/updateEmployeeRole');
const { updateEmployeeManager } = require('./helper/update/updateEmployeeManager');
const { viewEmployeesByDepartment } = require('./helper/view/viewEmployeesByDepartment');
const { viewEmployeesByManager } = require('./helper/view/viewEmployeesByManager');
const { deleteDepartment } = require('./helper/delete/deleteDepartment');
const { deleteRole } = require('./helper/delete/deleteRole');
const { deleteEmployee } = require('./helper/delete/deleteEmployee');
const { viewDepartmentBudget } = require('./helper/view/viewDepartmentBudget');

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