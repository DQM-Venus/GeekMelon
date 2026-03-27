FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace
COPY backend/.mvn /workspace/backend/.mvn
COPY backend/mvnw /workspace/backend/mvnw
COPY backend/pom.xml /workspace/backend/pom.xml
RUN chmod +x /workspace/backend/mvnw
COPY backend/src /workspace/backend/src
RUN /workspace/backend/mvnw -f /workspace/backend/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

COPY crawler/requirements.txt /app/crawler/requirements.txt
RUN pip3 install --no-cache-dir -r /app/crawler/requirements.txt

COPY crawler /app/crawler
COPY --from=build /workspace/backend/target/*.jar /app/backend.jar

ENV GM_CRAWLER_RUNNER_MODE=embedded
ENV GM_CRAWLER_PYTHON_COMMAND=python3
ENV GM_CRAWLER_WORKING_DIRECTORY=/app/crawler
ENV GM_CRAWLER_API_BASE_URL=http://127.0.0.1:8080

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]
