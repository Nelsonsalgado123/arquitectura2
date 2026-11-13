# Etapa 1: Compilar proyecto Maven multimódulo (Arquitectura Onion)
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml ./
COPY dominio dominio
COPY core core
COPY infraestructura infraestructura
COPY aplicacion aplicacion
COPY presentacion presentacion
RUN mvn clean package -DskipTests -B

# Etapa 2: Imagen liviana de ejecución Java 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR compilado desde la etapa builder
COPY --from=builder /build/presentacion/target/presentacion-0.0.1-SNAPSHOT.jar /app/apimonedas.jar

# Perfil por defecto (docker-compose sobrescribe a 'calendario' o 'docker')
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8080

CMD ["java", "-jar", "apimonedas.jar"]
