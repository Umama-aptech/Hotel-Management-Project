# LuxuryStay Hospitality - Hotel Management System (HMS)

This is a complete, fully functional MERN stack web application for the LuxuryStay Hotel Management System.

## Project Structure

- `backend/`: Node.js, Express, MongoDB server.
- `frontend/`: React.js (Vite) client application.

## Prerequisites

- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017` or update the `.env` file)

## Installation & Setup

1. **Backend Setup**
   Open a terminal and navigate to the backend directory:
   ```bash
   cd LuxuryStay_HMS/backend
   npm install
   ```

2. **Frontend Setup**
   Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd LuxuryStay_HMS/frontend
   npm install
   ```

## Running the Application

You need to run both the frontend and backend servers simultaneously.

**Start Backend Server:**
```bash
cd LuxuryStay_HMS/backend
node server.js
```
*The API will be available at `http://localhost:5000`*

**Start Frontend Application:**
```bash
cd LuxuryStay_HMS/frontend
npm run dev
```
*The app will open in your browser at `http://localhost:5173` (or similar Vite port)*

## Initial Database Setup (Sample Data)

To log in to the application for the first time, you need an Admin user in your database. 
You can create one via Postman, or use a quick MongoDB shell script, or run a REST request:

**Create Test Admin User via cURL / Postman / ThunderClient:**
Make a **POST** request to `http://localhost:5000/api/auth/register` with this JSON body:
```json
{
  "name": "System Admin",
  "email": "admin@luxurystay.com",
  "password": "password123",
  "role": "admin"
}
```

Once created, you can log in to the React frontend using:
- **Email:** `admin@luxurystay.com`
- **Password:** `password123`

## Features Included

- **JWT Authentication:** Secure login for multi-role users (Admin, Receptionist).
- **Admin Dashboard:** Overview statistics of total rooms, occupied rooms, revenue.
- **Room Management:** Add new rooms, adjust pricing, modify room status (Cleaning, Maintenance).
- **Booking Management:** Creating reservations, checking in guests, checking out, and calculating dynamic totals based on dates and room prices.
- **RESTful API:** Clean separation of concerns with mongoose data modeling.
- **React Router:** Protected routing enforcing user privilege levels.

## Technologies Used

- **MongoDB / Mongoose** - Document Database
- **Express.js** - Server framework
- **React.js** - Client-side UI using Hooks and Vite, styled with custom clean CSS structure.
- **Node.js** - JavaScript Runtime
- **JSON Web Tokens (JWT)** & **Bcrypt.js** - Security & Authentication layer
- **Axios** - Network Requests
- **Lucide-React** - SVG Icon Library
