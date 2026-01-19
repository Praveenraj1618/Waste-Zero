# WasteZero 

This branch contains the complete implementation of the WasteZero project, including Backend and Frontend modules.

## Project Structure

- **backend/**: Node.js/Express backend with MongoDB.
- **frontend/**: React frontend with Tailwind CSS and Shadcn UI.

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Run `npm install`
3. Create a `.env` file with your credentials (see `.env.example` if available, or use standard keys: PORT, MONGO_URI, JWT_SECRET).
4. Run `npm start` or `npm run dev`

### Frontend
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev` to start the development server.

## Features
- User Authentication (Volunteer, NGO, Admin)
- Opportunity Management (CRUD)
- Waste Pickup Scheduling
- Real-time Messaging
- Admin Dashboard & Analytics
- Reporting System

## Documentation
See `frontend/combined_frontend_docs.md` for detailed frontend documentation.
