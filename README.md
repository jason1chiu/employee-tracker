# Employee Management System
## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) The application is covered under the [MIT License](https://opensource.org/licenses/MIT).
## Description
My motivation is to create a robust and user-friendly employee tracker application that can help businesses manage their departments, roles, and employees efficiently. You built this project to create a command-line application that allows business owners to view and manage departments, roles, and employees in their company, so they can organize and plan their business more efficiently. The employee tracker application solves the problem of managing and organizing a company's employee database, allowing business owners to easily view and manage departments, roles, and employees in order to plan and grow their business effectively. Through building an employee tracker command-line application using Node.js, Inquirer, and MySQL, I learned how to interact with a database, perform SQL queries, and create a user-friendly interface to manage employee data.
## Table of Contents:
1. [Installation](#installation)
2. [Usage](#usage)
3. [Credits](#credits)
4. [Features](#features)
5. [Contribute](#contribute)
6. [Test](#test)
7. [Questions](#questions)

## Installation
1. Go to this [GitHub Repo](https://github.com/jason1chiu/employee-tracker).
2. Git clone this repo using HTTPS or SSH into a folder of your choice.
3. Install [node.js](https://nodejs.org/en/).
4. Enter "npm i" in the command-line application to install the necessary node modules.
5. Install [MySQL](https://dev.mysql.com/downloads/shell/).


## Usage
To start using the Employee Tracker application, open your terminal and navigate to the folder where you have saved the application. In the application's ./db folder, you will find two SQL files that can be used to create the default database. Once you have installed MySQL, you can access the MySQL interface by opening the terminal and entering "mysql -u root -p", followed by your password. From there, you can enter "source ./db/schema.sql" and "source ./db/seeds.sql" to create the necessary database. Once complete, type "exit" and use Node.js to run the application by entering "node server" or "npm start." The application will present users with a menu of options to view, add, or update information related to departments, roles, and employees. Users can easily view data in formatted tables, add or update information using the Inquirer package, and utilize the console.table package to display data.

## Credits
### Collaborators
None

### Third-Party
1. [node.js](https://nodejs.org/en/)
2. [npm inquirer v8.2.4](https://www.npmjs.com/package/inquirer/v/8.2.4)
3. [npm console.table](https://www.npmjs.com/package/console.table)
4. [npm mysql2](https://www.npmjs.com/package/mysql2)
5. [MySQL](https://dev.mysql.com/downloads/shell/)


### Tutorials
None

## Features
Our employee tracker application is a comprehensive tool for managing the departments, roles, and employees of a company. It offers a range of features such as viewing all departments, roles, and employees in a formatted table, as well as adding new departments, roles, and employees to the database. In addition to these core features, our application includes several optional features that enhance its functionality, such as updating employee roles, viewing employees by manager or department, and deleting departments, roles, and employees. Users can also view the total utilized budget of a department, which is the combined salaries of all employees in that department. We have implemented error handling and input validation to ensure a seamless user experience, and our application uses the Inquirer and console.table packages to facilitate user interaction and data display. Overall, our employee tracker application is an efficient tool for managing a company's employee database and supporting its organizational and planning needs.

## Contribute
1. Fork the repository.
2. Create a new branch.
3. Write and test your code.
4. Commit your changes with detailed comments.
5. Push your changes to GitHub.
6. Open a pull request.
7. Merge your pull request.

## Test
[https://drive.google.com/file/d/1xcFxXGgLK3kJBAtkPT-yYpZDxE1IQW6U/view](https://drive.google.com/file/d/1xcFxXGgLK3kJBAtkPT-yYpZDxE1IQW6U/view)

## Questions
If you like to see my other projects, my GitHub username is [jason1chiu](https://github.com/jason1chiu) and my GitHub profile is [https://github.com/jason1chiu](https://github.com/jason1chiu). Furthermore you may email me at jasonchiu2@yahoo.com if you have any additional questions.
