FROM eclipse-temurin:21-jdk-jammy

# Install Maven
RUN apt-get update && apt-get install -y maven

# Set working directory
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Create a startup script
RUN echo '#!/bin/bash\njava -Dserver.port=$PORT -jar target/shared-list-0.0.1-SNAPSHOT.jar' > /app/start.sh && chmod +x /app/start.sh

# Run the application
ENTRYPOINT ["/app/start.sh"]