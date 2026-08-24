# Support CRM System

A full-stack customer support ticket management system for creating, searching, filtering, viewing, and updating support tickets.

## Features

- Create tickets with customer name, email, subject, and description.
- Automatically generate ticket IDs and timestamps.
- View all tickets in a clean table.
- Search by customer name, email, ticket ID, subject, or description.
- Filter tickets by `Open`, `In Progress`, or `Closed` status.
- View complete ticket details.
- Update ticket status.
- Add notes and comments to tickets.
- Consistent API responses and centralized backend error handling.

## Tech Stack

| Layer      | Technologies                                              |
| ---------- | --------------------------------------------------------- |
| Frontend   | React, Vite, Tailwind CSS, shadcn/ui, Axios, React Router |
| Backend    | Node.js, Express.js                                       |
| Database   | MongoDB, Mongoose, MongoDB Atlas                          |
| Deployment | Vercel (frontend), Render (backend)                       |

## Project Architecture

- `backend/index.js` loads environment variables, connects to MongoDB, and starts the server.
- `backend/server.js` configures Express, middleware, routes, and global error handling.
- Routes map HTTP requests to controller functions.
- Controllers contain ticket and note business logic.
- Models define MongoDB/Mongoose schemas.
- Utilities provide `ApiError`, `ApiResponse`, and `asyncHandler`.
- The frontend uses Axios to communicate with the backend and React Router for navigation.

## Folder Structure

```text
support-crm/
├── backend/
│   ├── config/db.js
│   ├── controllers/ticketController.js
│   ├── models/Note.js
│   ├── models/Ticket.js
│   ├── routes/ticketRoutes.js
│   ├── utils/
│   ├── index.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vercel.json
│   └── package.json
└── README.md
```

## Installation and Local Setup

### Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster or local MongoDB instance

### Backend

1. Open a terminal in `backend/`.
2. Install dependencies with `npm install`.
3. Create `backend/.env` using the variables below.
4. Start the server with `npm start`.

The backend runs on port `5000` by default.

### Frontend

1. Open a second terminal in `frontend/`.
2. Install dependencies with `npm install`.
3. Start the Vite development server with `npm run dev`.
4. Open the local URL shown by Vite, usually `http://localhost:5173`.

The current Axios configuration uses the deployed Render API URL in `frontend/src/services/api.js`. For fully local development, change that URL to `http://localhost:5000/api`.

## Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
PORT=5000
```

`PORT` is optional. Never commit `.env` files or database credentials.

## API Endpoints

All endpoints use the `/api` prefix.

### Create a ticket

`POST /api/tickets`

Request:

```json
{
  "customer_name": "Alex Johnson",
  "customer_email": "alex@example.com",
  "subject": "Unable to sign in",
  "description": "The password reset link is not working."
}
```

Response (`201 Created`):

```json
{
  "statusCode": 201,
  "data": {
    "ticket_id": "TKT-007",
    "created_at": "2026-08-24T10:00:00.000Z"
  },
  "message": "Ticket created successfully",
  "success": true
}
```

### List tickets

`GET /api/tickets`

Optional query parameters:

- `search`: case-insensitive search across customer, ticket, subject, and description fields.
- `status`: `Open`, `In Progress`, or `Closed`.

Examples: `GET /api/tickets?search=alex` or `GET /api/tickets?status=Open`

Response (`200 OK`):

```json
{
  "statusCode": 200,
  "data": [
    {
      "ticket_id": "TKT-007",
      "customer_name": "Alex Johnson",
      "customer_email": "alex@example.com",
      "subject": "Unable to sign in",
      "description": "The password reset link is not working.",
      "status": "Open",
      "createdAt": "2026-08-24T10:00:00.000Z",
      "updatedAt": "2026-08-24T10:00:00.000Z"
    }
  ],
  "message": "Tickets fetched successfully",
  "success": true
}
```

Tickets are sorted newest first.

### Get ticket details

`GET /api/tickets/:ticket_id`

Example: `GET /api/tickets/TKT-007`

Response data contains the ticket and its notes:

```json
{
  "statusCode": 200,
  "data": {
    "ticket": { "ticket_id": "TKT-007", "status": "Open" },
    "notes": []
  },
  "message": "Ticket fetched successfully",
  "success": true
}
```

### Update a ticket

`PUT /api/tickets/:ticket_id`

Request:

```json
{
  "status": "In Progress",
  "note": "The issue is being investigated."
}
```

The `status` and `note` fields are optional. Invalid statuses return an error response.

## How the Application Works

1. The frontend submits ticket actions through Axios.
2. Express routes pass requests to the ticket controller.
3. Controllers validate input and query or update MongoDB through Mongoose.
4. Successful operations return the consistent `ApiResponse` format.
5. `asyncHandler` forwards asynchronous errors to global Express error middleware.
6. The ticket list supports server-side regex search, status filtering, and newest-first sorting.

## Deployment Information

- Frontend: deployed on Vercel from the `frontend/` directory.
- Backend: deployed on Render from the `backend/` directory.
- Database: hosted on MongoDB Atlas.
- Configure `MONGODB_URI` in the Render environment variables.
- The frontend API service currently points to the deployed Render backend.
- `frontend/vercel.json` rewrites client-side routes to `index.html`, allowing direct refreshes of ticket detail URLs.

## Screenshots

Add screenshots here after deployment:

![Ticket list](./screenshots/ticket-list.png)

![Ticket details](./screenshots/ticket-details.png)

## Challenges and Solutions

- **Client-side route refreshes returned 404:** Added a Vercel rewrite so React Router routes are served by the frontend entry point.
- **Consistent API error handling:** Added `ApiError`, `asyncHandler`, and centralized Express error middleware.
- **Flexible ticket discovery:** Implemented case-insensitive MongoDB regex search and status filtering.
- **Reliable frontend-backend communication:** Configured CORS on Express and Axios on the frontend.

## Future Improvements

- Add authentication and role-based access control.
- Add pagination for large ticket lists.
- Add stronger request validation and email validation.
- Add automated backend and frontend tests.
- Add ticket priority, assignment, and SLA tracking.
- Add notifications and dashboard analytics.

## Author

**Nagendra**
