FROM mongo:latest

# Copia el script de inicialización para poblar la BD divisionpolitica automáticamente
COPY iniciarBDDivisionPolitica.js /docker-entrypoint-initdb.d/

EXPOSE 27017
