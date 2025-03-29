# Use official OpenJDK 17 image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file from the target directory
COPY server/target/server-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend port
EXPOSE 5000

# Run the application
CMD ["java", "-jar", "app.jar"]
