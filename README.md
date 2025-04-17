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

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/auth/login` | OAuth 2.0 Login |
| `GET` | `/api/posts` | Fetch all posts |
| `POST` | `/api/posts` | Create a new post |
| `DELETE` | `/api/posts/{id}` | Delete a post |
| `POST` | `/api/comments` | Add a comment |

## 👥 Contributors
- [Dulhara Kaushalya](https://github.com/dulhara79)  
- [Senuvi Layathma](https://github.com/SENUVI20)
- [Dewdu Sendanayake](https://github.com/DewduSendanayake)
- [Uvindu Seneviratne](https://github.com/UVINDUSEN)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

