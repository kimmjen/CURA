# ===== Stage 1: Build Dependencies (Cached Layer) =====
FROM gradle:8.5-jdk17 AS dependencies
WORKDIR /app

# Copy only dependency files for better caching
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon || true

# ===== Stage 2: Build Application =====
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# Copy cached dependencies
COPY --from=dependencies /root/.gradle /root/.gradle

# Copy source code
COPY build.gradle settings.gradle ./
COPY src ./src

# Build the application
RUN gradle bootJar --no-daemon

# ===== Stage 3: Runtime =====
FROM eclipse-temurin:17-jre
WORKDIR /app

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Create logs directory
RUN mkdir -p /app/logs && chown -R spring:spring /app

# Copy the built JAR
COPY --from=builder --chown=spring:spring /app/build/libs/*.jar app.jar

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8001

# Health check using Actuator endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8001/actuator/health/liveness || exit 1

# JVM Options for production
ENV JAVA_OPTS="\
    -XX:+UseG1GC \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseContainerSupport \
    -XX:MaxGCPauseMillis=100 \
    -XX:+UnlockExperimentalVMOptions \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=production"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
