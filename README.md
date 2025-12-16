# MERN Stack Movie Application 

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) movie application with JWT authentication and role-based access control.  
Users can browse, search, and sort movies, while Admins can add and delete movies.

### User Features
- View movie list
- Search movies by **name or description**
- Sort movies by:
  - Name
  - Rating
  - Release Date
  - Duration
- Responsive UI using **Material-UI**

### Admin Features
- Admin login using JWT
- Add new movie details
- Delete existing movies
- Admin-only buttons hidden from normal users

---

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- MongoDB + Mongoose

### Database
- MongoDB Atlas (Cloud Database)

---

## Project Structure

Backend Setup
cd backend
npm install
node server.js


Backend will run at:

https://mern-movie-backend-production.up.railway.app/api/movies

3️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend will run at:

https://mern-movie-project-rouge.vercel.app/


