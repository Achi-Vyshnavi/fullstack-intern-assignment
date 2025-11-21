# fullstack-intern-assignment

This project demonstrates a complete end‑to‑end fullstack solution built with Node.js, Express, MySQL, Vue.js, Vuetify, and Axios.  
It fulfills every requirement of the assignment with clean architecture, robust error handling, and a professional frontend experience.  

The backend fetches 1000 users from the RandomUser API, stores them in MySQL, and exposes RESTful APIs.  
The frontend consumes only the backend APIs, displaying users in a Vuetify data table with pagination, filters, and inline editing.  

This repo is designed to be plug‑and‑play: clone, set up the database, run the backend, open the frontend — and you’re ready.

 Tech Stack
| Layer      | Technology |
|------------|------------|
| Backend    | Node.js, Express, Axios, MySQL2 |
| Frontend   | Vue.js (CDN), Vuetify (CDN), Axios |
| Database   | MySQL |
| Styling    | Vuetify Material Design |

Project Structure
fullstack-intern-assignment/ ├── backend/ │ └── server.js # Express backend with APIs ├── frontend/ │ └── index.html # Vue + Vuetify frontend ├── schema.sql # MySQL schema ├── package.json # Dependencies + scripts └── README.md # Documentation

Code
Database Setup
Run the schema file to create the database and table:
bash
mysql -u root -p < schema.sql
This creates:

Database: users_db

Table: users (uuid, name, email, city)

 Backend Setup
Install dependencies:

bash
npm install
Create .env file in project root:
Example code:
# .env.example
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=users_db
PORT=3000
Start server:

bash
npm start
Backend runs at: http://localhost:3000

API Endpoints
POST /api/users/fetch → Fetch 1000 users from RandomUser and insert into DB

GET /api/users → List all users

PUT /api/users/:uuid → Update a user (name, email, city)

Frontend Setup
Open frontend/index.html in a browser. It connects to http://localhost:3000/api/users.

Features
Vuetify data table with columns: Name, Email, City, Action (Edit)

25 rows per page with pagination

Global search + filters for each column

Edit dialog with PUT request to backend

Responsive design for desktop and mobile

Highlights
Professional architecture: clear separation of backend, frontend, and database.

Robust error handling: backend validates inputs and returns meaningful errors.

Scalable design: MySQL pool connections, batch inserts, and upsert logic.

User‑friendly UI: Vuetify table with intuitive filters and edit dialogs.

This project was built with attention to detail, scalability, and clarity. It not only meets the assignment requirements but also demonstrates production‑ready practices such as environment variables, modular structure, and clean documentation.
                                           Thank you!
