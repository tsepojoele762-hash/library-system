# BIWA2110 Web Application Development Labtest
## Full-Stack Library Inventory Management Solution

### Technical Architecture Overview
- **Frontend Stack Component Layer:** ReactJS SPA utilizing Context hooks, controlled form structures, and validation rules bound to standard React Router elements.
- **Backend API Controller Subsystem:** Node/Express application architecture with explicit CRUD routes mirroring specified REST specifications.
- **Relational Data Mapping Strategy:** Integrated PostgreSQL storage schema engine managing atomic inventory mutations using isolation transactions.

### Installation and Boot Guidelines

#### 1. Database Schema Set up
Create your local PostgreSQL or MySQL workspace database and match structural configs within `./backend/src/config/db.js`:
- Default Database: `library_db`
- Default User: `postgres`
- Default Password Credential Seed: `admin123`

#### 2. Backend Engine Activation
```bash
cd backend
npm install
npm start
```

#### 3. Frontend App Component Mount
```bash
cd frontend
npm install
npm start
```

### Initial Administrative Security Access Token
- Use the designated membership system key for debugging or assessment tasks: **`MEM001`**
