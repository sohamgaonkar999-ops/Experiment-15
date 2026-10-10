# Vehicle Service Management System

Full Stack web application for a vehicle service center.
**React (frontend) -> Express REST API (backend) -> MySQL (database)**

| Layer | Technology | Port |
|---|---|---|
| Frontend | React.js (JavaScript, Vite) | 3000 |
| Backend | Node.js + Express.js | 5050 |
| Database | MySQL (`vehicle_service`) | 3306 |

> **Port note:** the backend normally uses port 5000, but on Mac **Control Center
> (AirPlay Receiver) already occupies port 5000**, so the backend cannot start there.
> This project therefore uses **5050** in `backend/.env` and `frontend/.env`.
> See section 3 if you want to go back to 5000.

---

## 1. FOLDER STRUCTURE (already created)

```
Vehicle-Service-Management/
│
├── backend/
│   ├── server.js                 <- Express server + all REST routes mounting
│   ├── db.js                     <- MySQL connection pool (mysql2)
│   ├── config.js                 <- reads DB details from .env
│   ├── .env                      <- YOUR MySQL username/password + backend PORT
│   ├── .env.example              <- template you copy to .env
│   ├── package.json
│   ├── routes/
│   │   ├── customers.js          <- CRUD for customers
│   │   ├── vehicles.js           <- CRUD for vehicles
│   │   ├── services.js           <- CRUD for services
│   │   └── dashboard.js          <- counting queries for the dashboard
│   └── sql/
│       ├── schema.sql            <- CREATE DATABASE + 3 TABLES
│       └── sample_data.sql       <- test data
│
└── frontend/
    ├── index.html
    ├── package.json
    │   ├── vite.config.js            <- React port 3000
│   ├── .env                      <- VITE_API_URL = backend address
    └── src/
        ├── main.jsx              <- React entry point
        ├── App.jsx               <- navigation + routes
        ├── api.js                <- ALL HTTP requests to Express
        ├── styles.css            <- all styling
        ├── components/           <- reusable forms, tables, navbar
        │   ├── Navbar.jsx
        │   ├── Alert.jsx
        │   ├── SearchBar.jsx
        │   ├── StatCard.jsx
        │   ├── CustomerForm.jsx
        │   ├── CustomerTable.jsx
        │   ├── VehicleForm.jsx
        │   ├── VehicleTable.jsx
        │   ├── ServiceForm.jsx
        │   └── ServiceTable.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Customers.jsx
            ├── Vehicles.jsx
            └── Services.jsx
```

---

## 2. EXACT COMMANDS TO RUN THE PROJECT

### STEP 1 - Create the database (MySQL Workbench)

1. Open **MySQL Workbench**.
2. Connect to your local MySQL server.
3. Click the **SQL editor** icon (the one with a `+`), then open:
   `backend/sql/schema.sql` -> click the lightning bolt (execute).
4. Open `backend/sql/sample_data.sql` -> execute it too.

Or from Terminal (password prompt will appear):

```bash
cd Vehicle-Service-Management/backend
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/sample_data.sql
```

### STEP 2 - Backend setup (Terminal window 1)

```bash
cd Vehicle-Service-Management/backend

# create the .env file and put your MySQL password in it
cp .env.example .env

npm install
npm start
```

You should see:

```
----------------------------------------
  Server running at: http://localhost:5050
----------------------------------------
MySQL connected successfully -> database: vehicle_service
```

### STEP 3 - Frontend setup (Terminal window 2)

```bash
cd Vehicle-Service-Management/frontend

npm install
npm start
```

You should see:

```
VITE v5.4.21  ready
  Local:   http://localhost:3000/
```

### STEP 4 - Open the app

Go to **http://localhost:3000** in Chrome.

### STEP 5 - Useful checks

```bash
# backend is alive
curl http://localhost:5050/

# dashboard numbers come from MySQL
curl http://localhost:5050/dashboard

# add a customer through the API
curl -X POST http://localhost:5050/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9999999999","email":"test@example.com","address":"Test Lane"}'

# search
curl "http://localhost:5050/customers?search=rahul"
curl "http://localhost:5050/services?status=Pending"
```

### Extra npm commands

```bash
npm run dev      # backend + nodemon (restarts automatically when you save a file)
npm run build    # frontend - makes a production build in frontend/dist
```

---

## 3. IF YOU GET `EADDRINUSE` (port already busy)

On macOS, **Control Center / AirPlay Receiver uses port 5000**, which is why this project
runs the backend on **5050**. If you ever see `Port 5050 is already in use`, check what is
holding it:

```bash
lsof -nP -iTCP:5050 -sTCP:LISTEN
```

You have two choices:

**Option A - go back to port 5000** (only possible if AirPlay Receiver is off):
1. System Settings -> General -> AirDrop & Handoff -> **AirPlay Receiver = Off**
2. `backend/.env` -> `PORT=5000`
3. `frontend/.env` -> `VITE_API_URL=http://localhost:5000`

**Option B - move to another free port:** change the same two files to any free port,
e.g. `PORT=5051` and `VITE_API_URL=http://localhost:5051`.

---

## 4. REST API REFERENCE

Every route works with **and** without the `/api` prefix.

### Customers

| Method | URL | Purpose |
|---|---|---|
| GET | `/customers` | list all (add `?search=rahul` to search) |
| GET | `/customers/:id` | single customer |
| POST | `/customers` | create |
| PUT | `/customers/:id` | update |
| DELETE | `/customers/:id` | delete |

### Vehicles

| Method | URL | Purpose |
|---|---|---|
| GET | `/vehicles` | list all + customer name (add `?search=MH12`) |
| GET | `/vehicles/:id` | single vehicle |
| POST | `/vehicles` | create |
| PUT | `/vehicles/:id` | update |
| DELETE | `/vehicles/:id` | delete |

### Services

| Method | URL | Purpose |
|---|---|---|
| GET | `/services` | list all (add `?search=oil` and/or `?status=Pending`) |
| GET | `/services/:id` | single record |
| POST | `/services` | create |
| PUT | `/services/:id` | update |
| DELETE | `/services/:id` | delete |

### Dashboard

| Method | URL | Returns |
|---|---|---|
| GET | `/dashboard` | totalCustomers, totalVehicles, pendingServices, completedServices, inProgressServices, totalRevenue |

### Response format (always the same shape)

Success:

```json
{ "success": true, "message": "Customer added successfully", "id": 6 }
```

Error:

```json
{ "success": false, "message": "Phone number must be exactly 10 digits" }
```

---

## 5. DATABASE STRUCTURE

```
customers                 vehicles                        services
---------                 --------                        --------
id (PK, auto inc)  <---   id (PK, auto inc)  <---        id (PK, auto inc)
name                      customer_id (FK)               vehicle_id (FK)
phone                     vehicle_number (unique)         service_date
email                     vehicle_model                   service_type
address                   vehicle_type                    description
                                                          status
                                                          cost
```

* **One customer -> many vehicles** (`vehicles.customer_id`)
* **One vehicle -> many service records** (`services.vehicle_id`)
* `ON DELETE CASCADE` means deleting a customer also deletes that customer's vehicles
  and all their service records.

---

## 6. HOW IT WORKS (for the viva)

```
┌─────────────────────┐   HTTP (fetch)    ┌──────────────────────┐   SQL    ┌──────────┐
│   REACT FRONTEND    │  ──────────────►  │   EXPRESS BACKEND   │  ──────► │  MYSQL   │
│   localhost:3000    │  ◄──────────────  │   localhost:5000     │  ◄────── │vehicle_  │
│                     │      JSON        │                      │  rows    │ service  │
│  Pages + Components │                   │  routes/ + db.js     │           │          │
└─────────────────────┘                   └──────────────────────┘           └──────────┘
```

1. **User clicks a button in React** (browser). React runs JavaScript on the client side.
2. **React calls the API** using `fetch()` inside `src/api.js`, e.g.
   `fetch('http://localhost:5000/customers')`.
3. **CORS** (the `cors` package in `server.js`) allows this, because React (port 3000) and
   Express (port 5000) are technically different origins.
4. **Express receives the HTTP request** and the matching file in `backend/routes/`
   runs the SQL query through `db.js`.
5. **`db.js` uses the `mysql2` connection pool** to send the SQL to MySQL.
6. **MySQL returns rows** (JSON) -> **Express sends them back as JSON**.
7. **React receives the JSON**, stores it in a `useState` variable and `useEffect`
   automatically re-renders the page with the new data.

### One good viva question: *"Why do you need two ports?"*
Answer: A React dev server is only a frontend. It cannot read MySQL directly (the
database password would be visible to anyone). So the backend is a separate server that
holds the secret, talks to MySQL, and exposes only safe HTTP endpoints. Frontend and
backend run independently - that is exactly what "Full Stack" and "3-Tier Architecture"
means.

### One good viva question: *"What is a REST API?"*
Answer: REST is a style of designing web URLs. Each table has a URL (`/customers`), and
the HTTP method says what to do: `GET` = read, `POST` = create, `PUT` = update,
`DELETE` = remove. It returns JSON, so any frontend (React, mobile app) can use it.

### One good viva question: *"What is the difference between `routes/` and `db.js`?"*
Answer: `routes/` decides *what* to do with the request (validate, run query, send
response). `db.js` only knows *how* to talk to MySQL. Separating them keeps the code clean.

---

## 7. TESTING CHECKLIST (do this before submission)

**Dashboard** - open `http://localhost:3000`, confirm the 4+ cards show numbers.

**Customers** - Add (name + 10 digit phone) -> row appears. Edit -> name changes.
Delete -> row disappears. Search "rahul" -> only Rahul shows.

**Vehicles** - Add (choose customer, number, model, type) -> row appears with the
customer's name. Try the same vehicle number twice -> error "This vehicle number already
exists". Search "MH12".

**Services** - Add (choose vehicle, date, type, description, status, cost) -> row appears.
Edit and change status to Completed -> badge turns green. Click the `Pending` filter ->
only pending rows show. Delete a row.

**Error cases to demo**
| Try this | You should see |
|---|---|
| Phone with 3 digits | `Phone number must be exactly 10 digits` |
| Email `abc` | `Email is not valid` |
| Save service with status "Done" | `Status must be Pending, In Progress or Completed` |
| Stop the backend, then click a page | Red error box: backend not running |

**Extra credit demo:** delete a customer who owns a vehicle -> their vehicle and its
service records are deleted too (foreign key `ON DELETE CASCADE`).