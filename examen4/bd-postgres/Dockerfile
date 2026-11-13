FROM postgres:latest

# Copia los scripts de DDL, DML y secuencias en orden de ejecución
COPY 01_DDL_Monedas.sql /docker-entrypoint-initdb.d/
COPY 02_DML_Monedas.sql /docker-entrypoint-initdb.d/
COPY 03_DDL_Monedas_Secuencias.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
