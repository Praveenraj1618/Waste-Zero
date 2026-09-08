# WasteZero

**Community waste management · Volunteer coordination · Real-time messaging**

A full-stack application for organizing volunteer opportunities, scheduling waste pickups, and coordinating participants through a shared dashboard.

[Getting started](#getting-started) · [Architecture](#architecture) · [Demo walkthrough](#demo-walkthrough)

## Features

- Volunteer, NGO, and admin account workflows.
- Opportunity creation, applications, and participation management.
- Waste pickup scheduling and status management.
- Socket.IO messaging with typing, presence, delivery, and read events.
- Notifications, administrative controls, analytics, and reporting pages.

## Architecture

| Layer | Implementation |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Radix/shadcn UI |
| API | Node.js, Express, request validation |
| Database | MongoDB with Mongoose |
| Authentication | JWT and bcrypt |
| Messaging | Socket.IO server and browser client |

## Getting started

Prerequisites: Node.js with npm, Git, and a running MongoDB database.

```bash
git clone https://github.com/Praveenraj1618/Waste-Zero.git
cd Waste-Zero
```

### Backend

Create `backend/.env` with your local configuration:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wastezero
JWT_SECRET=replace-with-a-long-random-local-secret
UPLOAD_DIR=uploads
```

```bash
cd backend
npm install
npm run dev
```

Check http://localhost:5000 for the server response.

### Frontend

In a second terminal, starting from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the address printed by Vite. The API client defaults to `http://localhost:5000/api`. To override it, create `frontend/.env.local`:

```dotenv
VITE_API_BASE=http://localhost:5000/api
```

Restart Vite after configuration changes. If moving away from localhost, also review the socket endpoint in `frontend/src/services/socket.ts`.

## Demo walkthrough

1. Create accounts for the participant roles you want to demonstrate.
2. Create an opportunity and view it from a participant account.
3. Demonstrate participation or pickup scheduling.
4. Use two browser sessions to demonstrate messaging.
5. Explore the analytics and reporting pages using the available data.

## Project structure

| Path | Purpose |
| --- | --- |
| `backend/routes/` | REST endpoints grouped by feature |
| `backend/models/` | MongoDB document models |
| `backend/middleware/` | Authentication, upload, and validation helpers |
| `backend/server.js` | Express and Socket.IO entry point |
| `frontend/src/components/pages/` | Application screens |
| `frontend/src/services/` | API and socket clients |

For frontend implementation notes, see [combined frontend documentation](frontend/combined_frontend_docs.md).

## Build and status

Run `npm run build` from `frontend/` to generate the web build. Database-backed workflows require the backend and MongoDB; the frontend alone is not a complete running demo. End-to-end execution has not been verified as part of this documentation refresh.

## License

[MIT](LICENSE).
