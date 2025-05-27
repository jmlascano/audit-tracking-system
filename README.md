# Batis
- Audit tracking built for modern organizations
- Built using MERN stack (MariaDB, ExpressJS, React, NodeJS)

## How to set up
1. Make sure you have **MariaDB** or **mysql** installed
2. Make sure you have **NodeJS** installed
3. Make sure you have the **.env** file (will contain your root password hehe, and other information)
4. Log in to the root account
5. Enter `source org_mgt.mysql`
6. This should add the database, all the tables and tuples that are needed to run Batis

## How to run
1. In a terminal opened to the backend directory, enter:
```
npm i
npm start
```
This should show something like this:
```
˚ʚ♡ɞ˚ Backend Server ˚ʚ♡ɞ˚

🚀 Server is running!
Local: http://localhost:8080
Port: 8080

✅ Database connected successfully!
Host: localhost
User: root
Database: org_mgt
Port: 3306
```

2. In another terminal opened in the frontend directory, enter:
```
npm i
npm run dev
```
This should show a link like this: http://localhost:5173/

3. Enjoy the app by going to that link. Create an account, log in and have fun!!

