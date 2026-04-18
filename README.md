# Job Recruitment Portal

A full-stack, production-style job recruitment system built with React, Node.js, Express, and MySQL.

## 🚀 Project Link
🔗 [House Rent App](https://github.com/najmul032/House-Rent-App)

## 🚀 Features

### 👤 User Roles
- **Admin:** Manage users, approve/reject job posts, and oversee all applications.
- **Employer:** Create company profiles, post jobs, manage applicants, and update hiring status.
- **Job Seeker:** Build profiles, upload CVs, search for jobs, and track application status.

### 🛠 Core Functionality
- **Secure Auth:** JWT-based authentication with bcrypt password hashing.
- **Job Moderation:** Admin approval system for all new job posts.
- **File Upload:** CV/Resume upload using Multer.
- **Real-time Tracking:** Applicants can see their application status (Pending, Shortlisted, etc.) update in real-time.
- **Search & Filter:** Advanced job search by title, location, and type.
- **Responsive UI:** Clean, modern interface built with Tailwind CSS.

## 💻 Tech Stack

- **Frontend:** React.js, React Router, Axios, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL (mysql2).
- **Security:** JWT, bcryptjs.
- **File Handling:** Multer.

## 📂 Folder Structure

```text
/
├── backend/
│   ├── config/             # Database connection (mysql2)
│   ├── controllers/        # Business logic for APIs
│   ├── middleware/         # Auth & Role-based access control
│   ├── routes/             # API endpoints
│   └── uploads/            # CV/Resume storage
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth state management
│   ├── pages/              # Page views (Home, Dashboards, etc.)
│   └── services/           # API service (Axios)
├── server.ts               # Express server entry point
└── package.json            # Dependencies & Scripts
```

## 🛠 Installation & Setup

### 1. Database Setup
1. Install MySQL on your local machine.
2. Create a database named `job_portal`.
3. Run the queries provided in `db.sql` to create the tables.

### 2. Backend Configuration
1. Create a `.env` file in the root directory.
2. Add your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=job_portal
   DB_PORT=3306
   JWT_SECRET=your_secret_key
   ```

### 3. Run the Application
1. Install dependencies: `npm install`
2. Start the full-stack app: `npm run dev`
3. The app will be available at `http://localhost:3000`.

## 📝 API Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/jobs` | Get all approved jobs | No |
| POST | `/api/jobs` | Post a new job | Employer |
| POST | `/api/applications` | Apply for a job | Seeker |
| PUT | `/api/admin/jobs/:id/approve` | Approve a job | Admin |

## 🔮 Future Improvements
- AI-powered resume parsing.
- Email notifications for application updates.
- Interview scheduling module.
- Social login (Google/GitHub).
