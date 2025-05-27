DROP DATABASE IF EXISTS org_mgt;

-- Create Database
CREATE DATABASE org_mgt;

USE org_mgt;

-- Create Member Table
CREATE TABLE member(
	member_id INT AUTO_INCREMENT PRIMARY KEY,
	member_username VARCHAR(255) NOT NULL UNIQUE,
	member_name VARCHAR(255),
	member_password VARCHAR(255) NOT NULL,
	gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
	member_email VARCHAR(255) NOT NULL UNIQUE,
	degree_program VARCHAR(255)
);

-- Create Organization Table
CREATE TABLE org(
	org_id INT AUTO_INCREMENT PRIMARY KEY,
	org_username VARCHAR(255) NOT NULL UNIQUE,
	org_name VARCHAR(255),
	org_email VARCHAR(255) NOT NULL UNIQUE,
	org_password VARCHAR(255) NOT NULL
);

-- Create Org Event Table
CREATE TABLE org_event(
	org_id INT,
	event VARCHAR(255),
PRIMARY KEY(org_id, event),
CONSTRAINT orgevent_ordid_fk FOREIGN KEY(org_id) REFERENCES org(org_id)
);

-- Create Member Part of Org Table
-- acad year is like 2425, 2324, 2223
-- batch is org batch name e.g. "float(inf)", "hash", "yb15"
CREATE TABLE member_part_of_org(
	member_id INT,
	org_id INT,
	batch VARCHAR(255),
	acad_year INT(4),
	acad_sem ENUM('1', '2', 'm'),
	committee VARCHAR(255),
	role VARCHAR(255),
	status ENUM('Active', 'Inactive', 'Suspended', 'Expelled', 'Alumni'),
	PRIMARY KEY(member_id, org_id, acad_year, acad_sem),
	CONSTRAINT memberpartofof_memberid_fk FOREIGN KEY(member_id) REFERENCES member(member_id),
	CONSTRAINT memberpartofof_orgid_fk FOREIGN KEY(org_id) REFERENCES org(org_id)
);

-- Create Fee Table
CREATE TABLE fee(
	fee_id INT AUTO_INCREMENT PRIMARY KEY,
	fee_name VARCHAR(255),
	amount DECIMAL(10,2),
	due_date DATE,
	sem_issued ENUM('1', '2', 'm'),
	acad_year_issued INT(4),
	payment_date DATE,
	member_id INT,
	org_id INT,
	CONSTRAINT fee_memberid_fk FOREIGN KEY(member_id) REFERENCES member(member_id),
	CONSTRAINT fee_orgid_fk FOREIGN KEY(org_id) REFERENCES org(org_id)
);

INSERT INTO org (org_username, org_name, org_email, org_password) VALUES
('ilove127club', 'ilove127 Club', 'ilove127club@example.com', 'password123'),
('artcircle', 'Art Circle', 'artcircle@example.com', 'password123'),
('enviroorg', 'Environment Org', 'enviroorg@example.com', 'password123');

INSERT INTO member (member_username, member_name, member_password, gender, member_email, degree_program) VALUES
('jnmei', 'Jana Mei Lascano', 'password123', 'Female', 'janamei@example.com', 'BS Software Engineering'),
('giovannjosh', 'Giovann Josh Apolinar', 'password123', 'Male', 'giovannjosh@example.com', 'BS Computer Science'),
('alexgabriel', 'Alexander Gabriel Aranes', 'password123', 'Male', 'alexgabriel@example.com', 'BS Information Technology'),
('hugzbernados', 'Hugz Christian Bernados', 'password123', 'Male', 'hugzbernados@example.com', 'BS Computer Engineering'),
('mariagracy', 'Maria Gracy De Guzman', 'password123', 'Female', 'mariagracy@example.com', 'BS Information Systems'),
('danehenrich', 'Dane Henrich Garcia', 'password123', 'Other', 'danehenrich@example.com', 'BS Information Technology'),
('victorluis', 'Victor Luis Ibanez', 'password123', 'Male', 'victorluis@example.com', 'BS Computer Engineering'),
('mykojeff', 'Myko Jefferson Javier', 'password123', 'Male', 'mykojeff@example.com', 'BS Software Engineering'),
('shamellarosa', 'Shamel Larosa', 'password123', 'Female', 'shamellarosa@example.com', 'BS Computer Science'),
('gabmainit', 'Bien Gabriel Mainit', 'password123', 'Male', 'gabmainit@example.com', 'BS Information Technology'),
('tanyamarinelle', 'Tanya Marinelle Manaoat', 'password123', 'Female', 'tanyamarinelle@example.com', 'BS Computer Engineering'),
('normaniii', 'Norman III Marfa', 'password123', 'Male', 'normaniii@example.com', 'BS Software Engineering'),
('eronjay', 'Eron Jay Matira', 'password123', 'Male', 'eronjay@example.com', 'BS Information Systems'),
('justindayne', 'Justin Dayne Bryant Pena', 'password123', 'Male', 'justindayne@example.com', 'BS Computer Science'),
('yhannisg', 'Yhannis Geosh Prudencio', 'password123', 'Male', 'yhannisg@example.com', 'BS Information Systems'),
('yanikatauro', 'Yanika Illi Tauro', 'password123', 'Female', 'yanikatauro@example.com', 'BS Information Technology'),
('arabelaturdanes', 'Arabela Turdanes', 'password123', 'Female', 'arabelaturdanes@example.com', 'BS Software Engineering'),
('nicolephoebe', 'Nicole Phoebe Valentino', 'password123', 'Female', 'nicolephoebe@example.com', 'BS Computer Science'),
('tawimanamtam', 'Tawi Manamtam', 'password123', 'Male', 'tawimanamtam@example.com', 'BS Computer Engineering'),
('emybautista', 'John Emy Bautista', 'password123', 'Male', 'emybautista@example.com', 'BS Computer Science');

INSERT INTO member_part_of_org (member_id, org_id, batch, acad_year, acad_sem, committee, role, status) VALUES
(1, 1, 'hash', 2425, '1', 'Executive', 'President', 'Active'),
(1, 2, 'canvas', 2425, '1', 'Executive', 'President', 'Active'),
(2, 1, 'hash', 2425, 'm', 'Executive', 'VP Internal', 'Active'),
(3, 1, 'float(inf)', 2324, '2', 'Executive', 'Secretary', 'Inactive'),
(4, 2, 'yb15', 2324, '2', 'Creative', 'Artist', 'Active'),
(5, 2, 'yb15', 2425, '1', 'Logistics', 'Logistics', 'Active'),
(6, 3, 'sprout', 2223, 'm', 'Executive', 'Treasurer', 'Alumni'),
(7, 3, 'sprout', 2324, '1', 'General', 'Member', 'Active'),
(8, 1, 'hash', 2223, '2', 'Tech', 'Developer', 'Alumni'),
(9, 2, 'canvas', 2425, 'm', 'Creative', 'Artist', 'Active'),
(10, 3, 'earthforce', 2425, '1', 'Advocacy', 'Advocate', 'Active'),
(11, 2, 'canvas', 2324, '2', 'Creative', 'Exhibit Head', 'Inactive'),
(12, 3, 'earthforce', 2425, 'm', 'General', 'Member', 'Active'),
(13, 1, 'hash', 2324, 'm', 'General', 'Member', 'Active'),
(14, 1, 'hash', 2324, '1', 'Tech', 'Developer', 'Suspended'),
(15, 2, 'canvas', 2324, '2', 'Creative', 'Artist', 'Active'),
(16, 3, 'sprout', 2223, '1', 'General', 'Member', 'Alumni'),
(17, 1, 'hash', 2425, '1', 'Design', 'Design', 'Active'),
(18, 2, 'canvas', 2425, 'm', 'Logistics', 'Logistics', 'Active'),
(19, 3, 'earthforce', 2425, '2', 'Volunteers', 'Volunteer', 'Active'),
(20, 1, 'hash', 2324, 'm', 'Executive', 'President', 'Active'),
(12, 2, 'hash', 2425, '2', 'Tech', 'Developer', 'Active'),
(14, 1, 'hash', 2425, '2', 'Creative', 'Member', 'Inactive');

INSERT INTO fee (fee_name, amount, due_date, sem_issued, acad_year_issued, payment_date, member_id, org_id) VALUES
('Membership Fee', 100.00, '2024-09-30', '1', 2425, '2024-09-15', 1, 1),
('T-Shirt Fee', 250.00, '2024-09-25', '1', 2425, '2024-09-10', 2, 1),
('Seminar Fee', 300.00, '2024-02-10', '2', 2324, '2024-01-25', 3, 1),
('Art Supplies', 150.00, '2023-02-10', '2', 2324, '2023-02-01', 4, 2),
('Exhibit Fee', 400.00, '2024-09-20', '1', 2425, '2024-09-18', 5, 2),
('Planting Drive', 80.00, '2023-07-05', 'm', 2223, '2023-06-30', 6, 3),
('Eco Shirts', 200.00, '2023-09-10', '1', 2324, '2023-09-05', 7, 3),
('Workshop Fee', 120.00, '2022-11-15', '2', 2223, '2022-11-10', 8, 1),
('Journal Fee', 180.00, '2025-03-01', '2', 2425, '2025-02-20', 9, 2),
('Donation', 50.00, '2024-11-15', '2', 2425, '2024-11-10', 10, 3),
('Poster Fee', 90.00, '2023-10-12', '1', 2324, '2023-10-10', 11, 2),
('Outreach Fee', 110.00, '2025-05-05', 'm', 2425, '2025-04-30', 12, 3),
('Alumni Fund', 130.00, '2022-09-20', '1', 2223, '2022-09-10', 13, 1),
('Participation Fee', 95.00, '2024-10-06', '1', 2425, '2024-10-03', 14, 1),
('Paint Set', 170.00, '2024-10-09', '1', 2425, '2024-10-04', 15, 2),
('Green Kit', 210.00, '2024-10-16', '1', 2425, '2024-10-14', 16, 3),
('Tech Fee', 250.00, '2023-11-01', '2', 2324, '2023-10-20', 17, 1),
('Membership Dues', 100.00, '2025-02-18', '2', 2425, '2025-02-15', 18, 2),
('Support Fee', 85.00, '2025-03-20', 'm', 2425, '2025-03-15', 19, 3),
('Organizing Fee', 300.00, '2024-10-20', '1', 2425, '2024-10-18', 20, 1),
('Donation Drive', 60.00, '2024-09-15', '1', 2425, '2024-09-14', 2, 2),
('Volunteer Kit', 95.00, '2025-03-01', '2', 2425, '2025-02-28', 4, 3),
('Exhibit Entry', 150.00, '2023-11-20', '1', 2324, '2023-11-19', 6, 1),
('Sports Fund', 130.00, '2023-08-15', '1', 2324, '2023-08-13', 9, 2),
('Seminar Materials', 140.00, '2024-10-10', '1', 2425, '2024-10-09', 12, 3),
('Publicity Fee', 75.00, '2023-06-30', 'm', 2223, '2023-06-30', 17, 3),
('Event Snacks', 110.00, '2025-04-15', 'm', 2425, '2025-04-15', 18, 1),

-- Unpaid Fees 
('Membership Fee', 150.00, '2025-01-15', '2', 2425, NULL, 1, 1),
('Event Contribution', 200.00, '2024-09-30', '1', 2425, NULL, 5, 2),
('Annual Dues', 300.00, '2023-10-01', '1', 2324, NULL, 11, 3),
('Project Materials', 120.00, '2023-06-15', '2', 2324, NULL, 7, 2),
('Special Event Fee', 250.00, '2024-11-05', '1', 2425, NULL, 14, 1),
('T-Shirt Fee', 220.00, '2024-07-10', '1', 2425, '2024-07-15', 1, 1),
('Donation', 50.00, '2023-10-05', '1', 2324, '2023-10-10', 5, 2),
('Webinar Access', 180.00, '2024-11-01', '2', 2425, '2024-11-07', 8, 3),
('Registration Fee', 300.00, '2023-05-20', '2', 2223, '2023-06-01', 14, 3),
('Volunteer Shirt', 130.00, '2023-12-12', '2', 2324, '2023-12-20', 16, 2),
('Alumni Gathering', 200.00, '2024-08-05', '1', 2425, '2024-08-10', 19, 1),
('Tournament Fee', 90.00, '2024-07-01', '1', 2425, '2024-07-04', 20, 3),

-- Late Payments
('Membership Fee', 150.00, '2024-08-01', '1', 2425, '2024-08-10', 3, 1),
('Workshop Fee', 180.00, '2023-12-01', '2', 2324, '2023-12-15', 8, 3),
('Event Pass', 100.00, '2023-04-20', '2', 2223, '2023-05-01', 10, 2),
('Fundraising Contribution', 75.00, '2023-10-10', '1', 2324, '2023-10-25', 6, 1),
('Seminar Fee', 90.00, '2024-01-30', '2', 2425, '2024-02-05', 13, 3),
('Outreach Contribution', 125.00, '2025-02-28', '2', 2425, NULL, 3, 1),
('Yearbook Fee', 300.00, '2023-09-15', '1', 2324, NULL, 7, 2),
('Cultural Night', 150.00, '2024-12-10', '2', 2425, NULL, 11, 2),
('Foundation Support', 275.00, '2025-03-10', 'm', 2425, NULL, 13, 3),
('Magazine Subscription', 100.00, '2024-05-01', '2', 2324, NULL, 15, 1),
('Welcome Kit', 200.00, '2023-08-20', '1', 2324, NULL, 10, 2);


INSERT INTO org_event (org_id, event) VALUES
(1, 'Hackathon 2023'),
(1, 'Code Camp 2024'),
(2, 'Art Exhibit 2023'),
(2, 'Painting Workshop 2024'),
(3, 'Tree Planting 2023'),
(3, 'Eco Seminar 2024');