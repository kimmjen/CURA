# CURA Backend - Spring Boot (Pure Java)

Spring Boot 3.2 + Java 17 + Gradle 기반의 CURA 백엔드 서버입니다.

## 기술 스택

- **JDK**: Java 17 LTS (Eclipse Temurin)
- **Language**: Java 17
- **Framework**: Spring Boot 3.2
- **Build Tool**: Gradle 8.5 (Groovy DSL)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Spring Data JPA
- **Boilerplate**: Lombok
- **API Docs**: SpringDoc OpenAPI 3

## Kotlin vs Java

이 프로젝트는 Kotlin 버전(`backend-spring-kotlin`)과 동일한 기능을 순수 Java로 구현했습니다.

**주요 차이점**:
- Kotlin `data class` → Java `@Data` (Lombok)
- Kotlin `val` → Java `private final` (Lombok)
- Kotlin default parameters → Java `@Builder.Default`
- Groovy DSL vs Kotlin DSL

## 요구사항

- Java 17 LTS 이상
- Gradle 8.5 이상 (또는 Wrapper 사용)

## 설정

### 1. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

### 2. 로컬 실행

```bash
# Gradle Wrapper 사용
./gradlew bootRun

# 또는 빌드 후 실행
./gradlew build
java -jar build/libs/*.jar
```

서버 실행 후 접속:
- API: http://localhost:8001/api
- Swagger UI: http://localhost:8001/swagger-ui.html

### 3. Docker 실행

```bash
docker build -t cura-backend-spring .
docker run -p 8001:8001 --env-file .env cura-backend-spring
```

## API 엔드포인트

Kotlin 버전과 100% 동일한 API 제공

## 개발

```bash
# 테스트 실행
./gradlew test

# 빌드
./gradlew build
```

## 라이선스

MIT
