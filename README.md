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

# 🔗  Backend REST API Endpoints

The backend APIs are built using Spring Boot and provide RESTful endpoints for authentication, user management, and forum functionalities. All endpoints are prefixed with `/api` and support CORS from `http://localhost:5173`. Below are the API details in tabular format.

## Authentication APIs (`/api/auth`)

| Method | Endpoint                     | Description                                    | Authentication             |
|--------|------------------------------|------------------------------------------------|----------------------------|
| POST   | `/auth/login`                | Sends OTP for login                            | None                       |
| POST   | `/auth/login/verify`         | Verifies OTP and returns JWT                   | None                       |
| GET    | `/auth/google-redirect`      | Handles Google OAuth2 login                    | OAuth2                     |
| GET    | `/auth/login/failure`        | Handles Google login failure                   | None                       |
| GET    | `/auth/check-session`        | Validates session with JWT                     | Bearer Token               |
| POST   | `/auth/logout`               | Logs out user (client clears token)            | None                       |

## User Management APIs (`/api/users`)

| Method | Endpoint                             | Description                                    | Authentication             |
|--------|--------------------------------------|------------------------------------------------|----------------------------|
| POST   | `/users`                             | Registers a new user                           | None                       |
| POST   | `/users/{email}/verification`        | Verifies email with code                       | None                       |
| POST   | `/users/{userId}/follow/{targetUserId}` | Follows another user                        | Bearer Token               |
| POST   | `/users/{userId}/unfollow/{targetUserId}` | Unfollows another user                    | Bearer Token               |
| GET    | `/users/{userId}`                    | Retrieves user details                         | None                       |
| GET    | `/users/{userId}/suggested`          | Retrieves suggested users                      | None                       |
| PUT    | `/users/{id}`                        | Updates user profile                           | Bearer Token               |
| POST   | `/users/{id}/images`                 | Uploads profile/banner images                  | Bearer Token               |
| DELETE | `/users/{userId}`                    | Deletes user account                           | Bearer Token               |

## Forum APIs

### Forum Comments (`/api/forum/comments`)

| Method | Endpoint                             | Description                                    | Authentication             |
|--------|--------------------------------------|------------------------------------------------|----------------------------|
| POST   | `/forum/comments`                    | Creates a comment                              | Bearer Token               |
| PUT    | `/forum/comments/{id}`               | Updates a comment                              | Bearer Token               |
| DELETE | `/forum/comments/{id}`               | Deletes a comment                              | Bearer Token               |
| GET    | `/forum/comments/question/{questionId}` | Retrieves comments for a question           | None                       |
| PATCH  | `/forum/comments/{id}/vote`          | Upvotes/downvotes a comment                    | Bearer Token               |
| PATCH  | `/forum/comments/{id}/flag`          | Flags a comment                                | Bearer Token               |

### Forum Communities (`/api/communities`)

| Method | Endpoint                     | Description                                    | Authentication             |
|--------|------------------------------|------------------------------------------------|----------------------------|
| GET    | `/communities`               | Retrieves all communities                      | Bearer Token               |

### Forum Notifications (`/api/forum/notifications`)

| Method | Endpoint                             | Description                                    | Authentication             |
|--------|--------------------------------------|------------------------------------------------|----------------------------|
| GET    | `/forum/notifications`               | Retrieves unread notifications                 | Bearer Token               |
| POST   | `/forum/notifications/{id}/read`     | Marks notification as read                     | None                       |

### Forum Questions (`/api/questions`)

| Method | Endpoint                             | Description                                    | Authentication             |
|--------|--------------------------------------|------------------------------------------------|----------------------------|
| POST   | `/questions`                         | Creates a question                             | Bearer Token               |
| PUT    | `/questions/{id}`                    | Updates a question                             | Bearer Token               |
| DELETE | `/questions/{id}`                    | Deletes a question                             | Bearer Token               |
| GET    | `/questions`                         | Retrieves questions (filterable)               | None                       |
| GET    | `/questions/{id}`                    | Retrieves a question by ID                     | None                       |
| PATCH  | `/questions/{id}/vote`               | Upvotes/downvotes a question                   | Bearer Token               |
| PATCH  | `/questions/{id}/flag`               | Flags a question                               | Bearer Token               |
| POST   | `/questions/saved-questions`         | Saves a question                               | Bearer Token               |
| GET    | `/questions/saved-questions`         | Retrieves saved questions                      | Bearer Token               |
| DELETE | `/questions/saved-questions/{id}`    | Unsaves a question                             | Bearer Token               |
| PATCH  | `/questions/{id}/pin`                | Toggles pinning a question                     | Bearer Token               |

### Forum Tags (`/api/tags`)

| Method | Endpoint                     | Description                                    | Authentication             |
|--------|------------------------------|------------------------------------------------|----------------------------|
| GET    | `/tags`                      | Retrieves all tags                             | None                       |
| GET    | `/tags/search`               | Searches tags by query                         | None                       |
| GET    | `/tags/trending`             | Retrieves trending tags                        | None                       |
| DELETE | `/tags/{tagName}`            | Deletes a tag                                  | Bearer Token               |

## Notes

- **Authentication**: Endpoints requiring `Bearer Token` expect a JWT in the `Authorization` header (`Bearer <token>`). `OAuth2` is used for Google login.
- **HATEOAS**: Responses include `_links` for related resources.
- **Caching**: GET endpoints use `ETag` and `Cache-Control: max-age=300, must-revalidate`. Mutating endpoints use `Cache-Control: no-store`.
- **Error Handling**: Errors return JSON with an `error` field and HTTP status codes (400, 401, 404, etc.).
- **CORS**: All endpoints allow requests from `http://localhost:5173`.

For detailed request/response examples, refer to the source code or test endpoints using tools like Postman.
---

## 👥 Contributors
- [Dulhara Kaushalya](https://github.com/dulhara79)  
- [Senuvi Layathma](https://github.com/SENUVI20)
- [Dewdu Sendanayake](https://github.com/DewduSendanayake)
- [Uvindu Seneviratne](https://github.com/UVINDUSEN)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

