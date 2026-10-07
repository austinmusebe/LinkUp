# LinkUp

LinkUp is a web application for event discovery, event creation, and community networking. The application helps users find events that match their personal interests, create new events, and manage their scheduled activities.

## Project Pages

The project contains eight main pages:

### Landing (Landing.tsx)
The landing page is the main entry point of the application.

- It introduces the website purpose and core features.
- It provides navigation links to browse events, log in, or register an account.
- It shows featured images and quick-action buttons to explore community activities.

### Explore Events (EventsList.tsx)
The explore events page displays public events and personalized event recommendations.

- It calculates and displays a match score for each event based on user interests.
- A search input filters events by title and keyword.
- Category buttons and date range selectors filter displayed event cards.
- Each event card displays the date, location, interest tags, and organizer details.

### Event Details (EventDetails.tsx)
The event details page displays complete information for a selected event.

- It displays the event title, banner image, description, date, and location.
- It displays the name and contact details of the event organizer.
- It provides action buttons to edit or delete the event for the event creator.

### Create Event (CreateEvent.tsx)
The create event page allows registered users to publish new events.

- Users enter the event title, description, date, and location.
- Users select interest categories with interactive category buttons.
- An image input compresses uploaded photos to WebP format before storage.
- A submit button sends the event data to the server API.

### Edit Event (EditEvent.tsx)
The edit event page allows event creators to update existing event information.

- The form loads existing event details automatically.
- Users modify text fields, change selected categories, or upload a new image.
- A save button submits the updated event data to the server API.

### My Events (MyEvents.tsx)
The my events page displays all events created by the authenticated user.

- It displays a dedicated list of events created by the current user.
- It provides direct links to view or edit each event.
- It provides a delete button with a confirmation prompt to remove an event.
- It contains a quick-action button to navigate to the event creation form.

### Profile (Profile.tsx)
The profile page manages user account details and personal preferences.

- Users view and update their display name.
- Users upload a profile photo with automatic WebP compression.
- Users select personal interest categories to calibrate the recommendation system.
- A save button stores updated user profile data in the database.

### Authentication (Login.tsx and Signup.tsx)
The authentication pages manage user registration and account login.

- The signup page creates new user accounts with name, email, and password.
- The login page authenticates registered users with email and password credentials.
- The backend server issues a JSON Web Token (JWT) for secure session access.
- Successful authentication stores the session token and redirects the user.

## Deployment and Execution

### Prerequisites
Before you start the application, make sure you have installed:
- Bun runtime (version 1.1 or higher)
- A MongoDB database instance (local MongoDB or MongoDB Atlas)

### Environment Configuration
Create a `.env` file in the project root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Dependency Installation
Install all required dependencies for the client and server workspaces:

```bash
bun install
```

### Database Seeding (Optional)
Populate the database with initial sample users and events:

```bash
bun run --filter server seed
```

### Local Development Execution
Start both the backend server and frontend client concurrently:

```bash
bun run dev
```

Open the application in your web browser:
- Frontend client: http://localhost:5173
- Backend API server: http://localhost:3000

### Individual Service Execution
You can also start each service in separate terminal windows:

Start the backend server:
```bash
bun run dev:server
```

Start the frontend client:
```bash
bun run dev:client
```

### Stop Services
To terminate running processes on ports 3000 and 5173:

```bash
bun run stop
```
