FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY . .
RUN mvn -DskipTests -pl menu-service -am package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/menu-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
