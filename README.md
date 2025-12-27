# BloodBridge (Nepal) — Minimal Scaffold

This workspace contains a minimal scaffold for a Nepal-focused blood donation app.

Backend: [backend/index.js](backend/index.js)
Frontend: [frontend/src/App.jsx](frontend/src/App.jsx)
DB schema: [db/schema.sql](db/schema.sql)

Quick start

1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env to match your MySQL credentials
npm run dev
```

2. Database

Use MySQL Workbench or CLI to run `db/schema.sql` to create the `bloodbridge` database and sample data.

3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:4000`.

Next steps I can help with:

- Connect your MySQL Workbench to the running DB and import `db/schema.sql`.
- Add auth, admin UI, donor signup form, and search/filter by district/blood group.
# BloodBridge
