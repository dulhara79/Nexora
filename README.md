# Nexora
### Skill-Sharing & Learning Platform

<!--![Project Banner](https://via.placeholder.com/1000x300.png?text=Skill+Sharing+Platform) -->

## 🚀 Overview
The **Skill-Sharing & Learning Platform** is a web-based application that enables users to share and learn various skills, such as coding, cooking, photography, and DIY crafts. Users can post learning progress, interact with others, and track skill development in a social, engaging environment.

## 🔥 Key Features
### 🌟 Core Functionalities
- **User Authentication** (OAuth 2.0 login via Google)
- **Skill Sharing Posts** (Upload up to 3 images or short videos per post)
- **Learning Progress Updates** (Predefined templates for easy sharing)
- **Learning Plan Creation** (Structured skill development plans)
- **Interactivity & Engagement** (Like, comment, follow users, notifications)
- **User Profiles** (Publicly visible skill-sharing activities)

### 🧠 Innovative Features
- **AI-Powered Skill Recommendations** (Suggests relevant learning paths based on user activity)
- **Gamification & Rewards System** (Earn badges, level up, and unlock exclusive content)
- **AI-Powered Voice Assistance** (Voice-based skill search and progress updates)

## 🛠 Tech Stack
### 🖥️ Frontend
- React.js
- Redux (State Management)
- Tailwind CSS (Styling)
- Axios (API Calls)

### ⚙️ Backend
- Spring Boot (REST API)
- Spring Security (OAuth 2.0 Authentication)
- MongoDB (Database Management)
- WebSockets (Real-time Notifications)

<!--
## 🎨 System Architecture
![Architecture Diagram](https://via.placeholder.com/800x400.png?text=System+Architecture)
-->

## 🏗️ Installation & Setup
### 📌 Prerequisites
Ensure you have the following installed:
- Node.js (for the frontend)
- Java (for Spring Boot backend)
- MongoDB (Database setup)

### ⚡ Clone the Repository
```sh
 git clone https://github.com/dulhara79/Nexora.git
 cd Nexora
```

### 🖥️ Setting Up the Backend
```sh
 cd backend
 mvnw clean install
 mvnw spring-boot:run
```

### 🌐 Setting Up the Frontend
```sh
 cd frontend
 npm install
 npm run dev
```

---

## 🔗 REST API Endpoints

This document lists all REST API endpoints for the forum application. Endpoints are grouped by resource for clarity. All endpoints are prefixed with the base URL (e.g., `http://localhost:5000`).

### Users Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | `/api/users/register` | Registers a new user, optionally with a profile photo. Sets userId in session. | None |
| POST   | `/api/users/register/google` | Registers a new user via Google OAuth, optionally with a profile photo. | None |
| POST   | `/api/users/verify` | Verifies a user’s email with a verification code. | None |
| POST   | `/api/users/{userId}/follow/{targetUserId}` | Allows a user to follow another user. | None |
| POST   | `/api/users/{userId}/unfollow/{targetUserId}` | Allows a user to unfollow another user. | None |
| GET    | `/api/users/{userId}` | Retrieves a user’s details by ID. | None |
| GET    | `/api/users/` | Retrieves a list of all users. | None |
| PUT    | `/api/users/edit/{id}` | Updates a user’s profile (name, username, email, about, password, images, social media). | Session-based (userId in session, must match id) |
| DELETE | `/api/users/deactivate/{userId}` | Deactivates a user account by ID. | None |

### Authentication Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | `/api/auth/login` | Initiates login by sending an OTP to the user’s email. | None |
| POST   | `/api/auth/login/verify` | Verifies the login OTP and sets userId in session. | None |
| GET    | `/api/auth/google-success` | Handles successful Google OAuth login, sets userId in session, and closes the popup. | OAuth2 (Google) |
| GET    | `/api/auth/login/failure` | Returns an error response for failed Google OAuth login. | None |
| GET    | `/api/auth/check-session` | Checks if a session is active and returns user details. | Session-based (userId in session) |
| POST   | `/api/auth/logout` | Invalidates the session to log out the user. | None |

### Comments Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | `/api/forum/comments` | Creates a new comment for a question. | Session-based (userId in session) |
| PUT    | `/api/forum/comments/{id}` | Updates an existing comment by ID. | Session-based (userId in session) |
| DELETE | `/api/forum/comments/{id}` | Deletes a comment by ID. | Session-based (userId in session) |
| GET    | `/api/forum/comments/question/{questionId}` | Retrieves all comments for a specific question by question ID. | None |
| POST   | `/api/forum/comments/{id}/upvote` | Upvotes a comment by ID. | Session-based (userId in session) |
| POST   | `/api/forum/comments/{id}/downvote` | Downvotes a comment by ID. | Session-based (userId in session) |
| POST   | `/api/forum/comments/{id}/flag` | Flags a comment by ID for review. | Session-based (userId in session) |

### Communities Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | `/api/communities` | Retrieves a list of all communities. | None (authentication check commented out) |

### Notifications Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | `/api/forum/notifications` | Retrieves unread notifications for the authenticated user. | Session-based (userId in session) |
| POST   | `/api/forum/notifications/{id}/read` | Marks a notification as read by ID. | None |

### Questions Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | `/api/questions/add` | Creates a new question. | Session-based (userId in session) |
| PUT    | `/api/questions/{id}` | Updates an existing question by ID. | Session-based (userId in session) |
| DELETE | `/api/questions/{id}` | Deletes a question by ID. | Session-based (userId in session) |
| GET    | `/api/questions` | Retrieves a list of questions, optionally filtered by tag, search query, or sorted by a criterion (e.g., newest). | None |
| GET    | `/api/questions/{id}` | Retrieves a specific question by ID. | None |
| POST   | `/api/questions/{id}/upvote` | Upvotes a question by ID. | Session-based (userId in session) |
| POST   | `/api/questions/{id}/downvote` | Downvotes a question by ID. | Session-based (userId in session) |
| POST   | `/api/questions/{id}/flag` | Flags a question by ID for review. | Session-based (userId in session) |
| POST   | `/api/questions/{id}/save` | Saves a question for the authenticated user. | Session-based (userId in session) |
| GET    | `/api/questions/saved` | Retrieves all saved questions for the authenticated user. | Session-based (userId in session) |
| DELETE | `/api/questions/{id}/unsave` | Unsaves a question for the authenticated user. | Session-based (userId in session) |
| POST   | `/api/questions/{id}/view` | Increments the view count for a question by ID. | None |
| POST   | `/api/questions/{id}/pin` | Toggles the pinned status of a question by ID. | Session-based (userId in session) |

### Tags Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | `/api/tags` | Retrieves a list of all tags. | None |
| GET    | `/api/tags/search` | Searches for tags matching a query string. | None |
| GET    | `/api/tags/trending` | Retrieves the top 10 trending tags based on questions from the last 7 days. | None |

---

## 👥 Contributors
- [Dulhara Kaushalya](https://github.com/dulhara79)  
- [Senuvi Layathma](https://github.com/SENUVI20)
- [Dewdu Sendanayake](https://github.com/DewduSendanayake)
- [Uvindu Seneviratne](https://github.com/UVINDUSEN)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

