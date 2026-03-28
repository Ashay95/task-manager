## 🚀 Task Manager Full Stack App

A production-ready full-stack application with secure authentication, role-based access control, and scalable REST APIs.

Built using:
- Node.js + Express
- MongoDB (Mongoose)
- React (Vite)
- JWT Authentication
- Swagger Documentation

## 🔗 Quick Links

- Swagger Docs: http://localhost:5001/api-docs
- Frontend: http://localhost:5173

# Task App — Full-stack REST API + React UI

Production-oriented monorepo: **Express + MongoDB (Mongoose) + JWT + bcrypt** backend, and a **React (Vite)** client for register, login, and task management.

## Features

- JWT authentication; passwords hashed with bcrypt
- Roles: `USER` (default on register), `ADMIN` (created via script)
- Tasks scoped per user; **ADMIN** sees all tasks and is the only role allowed to **DELETE**
- Centralized error handling, input validation (`express-validator`), `helmet`, `express-mongo-sanitize`
- **Swagger UI** at `/api-docs` (OpenAPI 3)
- **Winston** + **Morgan** logging
- **Docker Compose** for MongoDB, API, and optional static frontend behind nginx

## Project layout

```text
backend/
  app.js              # Express app (middleware, routes, Swagger)
  server.js           # HTTP server + DB connect
  config/             # DB, Swagger
  controllers/
  routes/
  models/
  middleware/         # JWT auth, roles, validation, errors
  services/           # Business logic
  utils/
  validators/
frontend/             # Vite + React
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Docker)

## Environment variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

| Variable         | Description                                      |
|-----------------|---------------------------------------------------|
| `NODE_ENV`      | `development` or `production`                     |
| `PORT`          | API port (default `5000`)                         |
| `MONGODB_URI`   | Mongo connection string                           |
| `JWT_SECRET`    | Strong secret for signing JWTs                    |
| `JWT_EXPIRES_IN`| e.g. `7d`                                         |
| `CLIENT_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`)|

### Frontend (`frontend/.env`)

Optional. For local dev with Vite proxy, leave unset so requests use `/api/v1`.

| Variable          | Description                                      |
|-------------------|--------------------------------------------------|
| `VITE_API_URL`    | Full API base including `/api/v1` if not proxied |

## Local setup

### 1. MongoDB

```bash
# Example: Docker
docker run -d --name task-mongo -p 27017:27017 mongo:7
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set JWT_SECRET and MONGODB_URI

npm install
npm run dev
```

API: `http://localhost:5000`  
Swagger: `http://localhost:5000/api-docs`

### 3. Create an ADMIN user (optional)

Registration always creates `USER`. To promote or create an admin:

```bash
cd backend
node scripts/createAdmin.js "Admin Name" admin@example.com 'SecurePass1'
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:5000`.

### Production builds

```bash
cd frontend && npm run build   # output in frontend/dist
cd backend && NODE_ENV=production npm start
```

Serve `frontend/dist` with any static host and point `VITE_API_URL` (at build time) to your public API base URL, or use the provided Docker/nginx setup.

## Docker (full stack)

From the repo root:

```bash
export JWT_SECRET="$(openssl rand -hex 32)"
docker compose up --build
```

- API: `http://localhost:5000`
- UI (nginx → API): `http://localhost:8080`

Compose wires `MONGODB_URI=mongodb://mongo:27017/taskapp`. Create an admin inside the backend container:

```bash
docker compose exec backend node scripts/createAdmin.js "Admin" admin@example.com 'SecurePass1'
```

### Optional: Redis

A commented `redis` service is in `docker-compose.yml` for future caching or rate limiting; the app does not require Redis today.

## API endpoints (v1)

Base path: `/api/v1`

| Method | Path              | Auth | Roles   | Description |
|--------|-------------------|------|---------|-------------|
| POST   | `/auth/register`  | No   | —       | Register (`USER`) |
| POST   | `/auth/login`     | No   | —       | Login, returns JWT |
| GET    | `/tasks`          | JWT  | USER, ADMIN | List own tasks; **ADMIN** sees all |
| POST   | `/tasks`          | JWT  | USER, ADMIN | Create task (owned by current user) |
| PUT    | `/tasks/:id`      | JWT  | USER, ADMIN | Update own task; **ADMIN** can update any |
| DELETE | `/tasks/:id`      | JWT  | **ADMIN only** | Delete task |

Send JWT as: `Authorization: Bearer <token>`.

## Security notes

- Never commit `.env`; use long random `JWT_SECRET` in production
- JWT in `localStorage` is acceptable for this demo; for highest security in browsers, prefer **httpOnly** cookies + CSRF protections
- `helmet` and payload size limits reduce common attack surface; `express-mongo-sanitize` helps against NoSQL injection patterns in user input

## Scalability (short)

- **Horizontal scaling**: Run multiple stateless API instances behind a load balancer; all instances share the same `JWT_SECRET` and MongoDB (or replica set)
- **Caching**: Add Redis for hot reads (e.g. task lists) with explicit TTL and cache invalidation on writes
- **Microservices**: Extract auth, notifications, or heavy jobs into separate services with async messaging (e.g. queues) when domains and teams grow
- **Data layer**: Move from single MongoDB to replica sets; consider sharding if task volume per tenant explodes

## Scripts

| Command              | Where    | Purpose        |
|----------------------|----------|----------------|
| `npm run dev`        | backend  | Nodemon API    |
| `npm start`          | backend  | Production API |
| `npm run dev`        | frontend | Vite dev       |
| `npm run build`      | frontend | Static build   |


