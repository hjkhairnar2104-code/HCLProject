# Multi-stage Dockerfile for Spring Boot 3.4 & Java 21
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN chmod +x mvnw
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=8085
EXPOSE 8085
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
