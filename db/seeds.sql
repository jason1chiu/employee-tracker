INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance & Accounting'),
('Sales'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 80000, 1),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 100000, 1),
('Project Manager', 100000, 4),
('Operations Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Orson","Krennic", 5, 3),
('Devin', 'Anderson', 1, 1),
('Mary', 'Brown', 4, null),
('Ashley', 'Jones', 3, 3),
("Sheev", "Palpatine", 1, null),
('Ana', 'Sanchez', 5, 5),
("Gallius", "Rex", 4, 1),
('Katherine', 'Green', 8, 7);