FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY . .
RUN mvn -DskipTests -pl discovery -am package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/discovery/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
