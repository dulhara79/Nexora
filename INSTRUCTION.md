# Nexora Project

This repository contains both the **frontend** and **backend** of the Nexora project, which is a Dockerized full-stack application. Follow the steps below to set up and run the project using Docker.

## Prerequisites

Before running the project, make sure you have the following installed on your system:

- **Docker**: [Download Docker](https://www.docker.com/get-started)
- **Docker Compose**: Docker Compose is included with Docker Desktop, so if you have Docker installed, you should already have Docker Compose.

## Steps to Run the Project

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/Nexora.git
cd Nexora
```

### 2. Build and Run with Docker Compose

This project uses **Docker Compose** to manage both the frontend and backend containers. To build and start the containers, run the following command:

```bash
docker-compose up --build
```

This command will:
- Build the **frontend** and **backend** Docker images.
- Start the containers as services.

### 3. Access the Application

Once the containers are up and running, you can access the application in your browser:

- **Frontend**: Open your browser and go to `http://localhost:80` to access the frontend.
- **Backend**: The backend will be available on `http://localhost:8080` (if your backend exposes an API on that port).

### 4. Stopping the Containers

To stop the running containers, you can use the following command:

```bash
docker-compose down
```

This will stop and remove all the containers defined in the `docker-compose.yml` file.

## How the Docker Environment Works

### Backend (Spring Boot)
The backend is built using **Spring Boot** and Java 17. The backend Docker container is built using the **JDK 17** image and runs the Spring Boot application.

### Frontend (React with Vite)
The frontend is built using **React** and **Vite**. The frontend Docker container uses **Nginx** to serve the built React application. The Dockerfile handles the installation of dependencies and the build process for the frontend.

### Docker Files

- **Dockerfile (Frontend)**: Located in the `client/` directory. It builds the React app and serves it with Nginx.
- **Dockerfile (Backend)**: Located in the `server/` directory. It sets up the backend service with Java 17.

### Docker Compose
The **docker-compose.yml** file manages both the frontend and backend containers. It ensures that the two services (frontend and backend) run in their own isolated environments while allowing communication between them.

## Troubleshooting

- **Error: Docker is not running**
  - Make sure Docker is running on your machine. You can check this by running `docker info` in the terminal. If Docker is not running, start it from the Docker Desktop app.

- **Ports are already in use**
  - If port `80` or `8080` is already in use, you can change the ports in the `docker-compose.yml` file. For example, change the frontend port to `8081` and the backend port to `8082` by modifying the `ports` section.

## Conclusion

With Docker and Docker Compose, you can easily run the frontend and backend services in isolated containers, ensuring that all dependencies are managed within the containers themselves.

Feel free to reach out if you encounter any issues or need further assistance!

---