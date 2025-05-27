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
('codeclub', 'Code Club', 'codeclub@example.com', 'password123'),
('artcircle', 'Art Circle', 'artcircle@example.com', 'password123'),
('enviroorg', 'Environment Org', 'enviroorg@example.com', 'password123');

INSERT INTO member (member_username, member_name, member_password, gender, member_email, degree_program) VALUES
('user01', 'Alice Tan', 'pwd1', 'Female', 'alice01@example.com', 'BSCS'),
('user02', 'Ben Cruz', 'pwd2', 'Male', 'ben02@example.com', 'BSIT'),
('user03', 'Cara Yu', 'pwd3', 'Female', 'cara03@example.com', 'BSCS'),
('user04', 'Dale Lee', 'pwd4', 'Male', 'dale04@example.com', 'BSIS'),
('user05', 'Ella Reyes', 'pwd5', 'Female', 'ella05@example.com', 'BSCS'),
('user06', 'Frank Uy', 'pwd6', 'Male', 'frank06@example.com', 'BSIT'),
('user07', 'Gina Woo', 'pwd7', 'Female', 'gina07@example.com', 'BSIS'),
('user08', 'Hank Tan', 'pwd8', 'Male', 'hank08@example.com', 'BSCS'),
('user09', 'Ivy Lim', 'pwd9', 'Female', 'ivy09@example.com', 'BSIT'),
('user10', 'Jack Ong', 'pwd10', 'Male', 'jack10@example.com', 'BSCS'),
('user11', 'Kara Dela Cruz', 'pwd11', 'Female', 'kara11@example.com', 'BSIS'),
('user12', 'Liam Santos', 'pwd12', 'Male', 'liam12@example.com', 'BSCS'),
('user13', 'Mona Garcia', 'pwd13', 'Female', 'mona13@example.com', 'BSIT'),
('user14', 'Nico Rivera', 'pwd14', 'Male', 'nico14@example.com', 'BSCS'),
('user15', 'Olive Chan', 'pwd15', 'Female', 'olive15@example.com', 'BSIS'),
('user16', 'Paul Velasquez', 'pwd16', 'Male', 'paul16@example.com', 'BSIT'),
('user17', 'Quinn Yu', 'pwd17', 'Other', 'quinn17@example.com', 'BSCS'),
('user18', 'Ria Javier', 'pwd18', 'Female', 'ria18@example.com', 'BSIS'),
('user19', 'Sam Go', 'pwd19', 'Male', 'sam19@example.com', 'BSCS'),
('user20', 'Tina Lao', 'pwd20', 'Female', 'tina20@example.com', 'BSIT');

INSERT INTO member_part_of_org (member_id, org_id, batch, acad_year, acad_sem, committee, role, status) VALUES
(1, 1, 'hash', 2425, '1', 'Executive', 'President', 'Active'),
(2, 1, 'hash', 2425, '1', 'Executive', 'VP Internal', 'Active'),
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
(13, 1, 'hash', 2324, '1', 'General', 'Member', 'Active'),
(14, 1, 'hash', 2324, '1', 'Tech', 'Developer', 'Suspended'),
(15, 2, 'canvas', 2324, '2', 'Creative', 'Artist', 'Active'),
(16, 3, 'sprout', 2223, '1', 'General', 'Member', 'Alumni'),
(17, 1, 'hash', 2425, '1', 'Design', 'Design', 'Active'),
(18, 2, 'canvas', 2425, '2', 'Logistics', 'Logistics', 'Active'),
(19, 3, 'earthforce', 2425, '2', 'Volunteers', 'Volunteer', 'Active'),
(20, 1, 'hash', 2425, '2', 'Tech', 'Developer', 'Active');

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
('Organizing Fee', 300.00, '2024-10-20', '1', 2425, '2024-10-18', 20, 1);

-- Unpaid Fees 
INSERT INTO fee (fee_name, amount, due_date, sem_issued, acad_year_issued, payment_date, member_id, org_id) VALUES
('Membership Fee', 150.00, '2025-01-15', '2', 2425, NULL, 1, 1),
('Event Contribution', 200.00, '2024-09-30', '1', 2425, NULL, 5, 2),
('Annual Dues', 300.00, '2023-10-01', '1', 2324, NULL, 11, 3),
('Project Materials', 120.00, '2023-06-15', '2', 2324, NULL, 7, 2),
('Special Event Fee', 250.00, '2024-11-05', '1', 2425, NULL, 14, 1);

-- Late Payments
INSERT INTO fee (fee_name, amount, due_date, sem_issued, acad_year_issued, payment_date, member_id, org_id) VALUES
('Membership Fee', 150.00, '2024-08-01', '1', 2425, '2024-08-10', 3, 1),
('Workshop Fee', 180.00, '2023-12-01', '2', 2324, '2023-12-15', 8, 3),
('Event Pass', 100.00, '2023-04-20', '2', 2223, '2023-05-01', 10, 2),
('Fundraising Contribution', 75.00, '2023-10-10', '1', 2324, '2023-10-25', 6, 1),
('Seminar Fee', 90.00, '2024-01-30', '2', 2425, '2024-02-05', 13, 3);


INSERT INTO org_event (org_id, event) VALUES
(1, 'Hackathon 2023'),
(1, 'Code Camp 2024'),
(2, 'Art Exhibit 2023'),
(2, 'Painting Workshop 2024'),
(3, 'Tree Planting 2023'),
(3, 'Eco Seminar 2024');


/*
-- Insert 3 sample orgs
INSERT INTO org (org_username, org_name, org_password, org_email)
VALUES
('yses', "Young Software Engineers' Society", 'yses123', 'exec@yses.org'),
('coss', 'Computer Science Society', 'coss123', 'exec@coss.org'),
('acss', 'Alliance of Computer Science Students', 'acss123', 'exec@acss.org');

-- Insert 5 sample members
INSERT INTO member (member_username, member_name, member_password, gender, member_email, degree_program)
VALUES
('jnmei', 'Jana Mei Lascano', 'jana123', 'Female', 'jana@examle.com', null),
('may_bieu', 'Bien Mainit', 'bien123', 'Male', 'bien@examle.com', 'BS Computer Science'),
('dnhnrch', 'Dane Garcia', 'dane123', 'Female', 'dane@examle.com', 'BS Computer Science'),
('tawisaur', 'Thyron Manamtam', 'tawi123', "Other", 'tawi@example.com', 'BS Computer Science'),
('moonsky', 'Emy Bautista', 'emy123', "Other", 'emy@example.com', 'BS Computer Science'), 
('sir_reg', 'Reginald Recario', 'sirreg123', "Other", 'sirreg@example.com', null);

-- Insert 3 sample member_part_of_org
INSERT INTO member_part_of_org (member_id, org_id, batch, acad_year, acad_sem, committee_role, status)
VALUES
(1, 1, 'hash', 2425, '1', 'Member', 'Active'),
(1, 1, 'hash', 2425, '2', 'Member', 'Inactive'),
(3, 1, 'hash', 2425, '1', 'Member', 'Active'),
(3, 1, 'hash', 2425, '2', 'Treasurer', 'Active'),
(5, 1, 'hash', 2425, '1', 'Member', 'Active'),
(5, 1, 'hash', 2425, '2', 'President', 'Active'),
(2, 2, 'float(inf)', 2324, '2', 'Member', 'Active'),
(2, 2, 'float(inf)', 2324, 'm', 'Member', 'Active'),
(2, 2, 'float(inf)', 2425, '1', 'President', 'Active'),
(2, 2, 'float(inf)', 2425, '2', 'President', 'Active'),
(4, 2, 'float(inf)', 2324, '2', 'Member', 'Active'),
(4, 2, 'float(inf)', 2324, 'm', 'Member', 'Active'),
(4, 2, 'float(inf)', 2425, '1', 'Secretary', 'Active'),
(4, 2, 'float(inf)', 2425, '2', 'Secretary', 'Active');

INSERT INTO member_part_of_org (member_id, org_id, acad_year, acad_sem, status)
VALUES
(6, 1, 2425, '1', 'Alumni');

-- Insert sample fees
INSERT INTO fee (fee_name, amount, due_date, sem_issued, acad_year_issued, payment_date, member_id, org_id)
VALUES
('Membership Fee', 10.00, '2025-04-15', '2', 2425, '2025-04-20', 1, 1),
('Event Fee', 20.00, '2024-10-20', '1', 2425, '2024-10-25', 2, 2),
('Membership Fee', 30.00, '2025-04-15', '2', 2425, NULL, 3, 1);

-- Insert sample events
INSERT INTO org_event (org_id, event)
VALUES
(1, 'Ideathon'),
(2, 'WarFrames'),
(3, 'Sublimed');

*/