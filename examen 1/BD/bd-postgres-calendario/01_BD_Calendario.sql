-- Crear usuario y base de datos calendario
CREATE USER docker;
CREATE DATABASE calendario;
GRANT ALL PRIVILEGES ON DATABASE calendario TO docker;

\c calendario

GRANT ALL ON SCHEMA public TO docker;

/* Crear tabla TIPO */
CREATE TABLE Tipo(
	Id SERIAL PRIMARY KEY,
	Tipo VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX ixTipo ON Tipo(Tipo);

/* Crear tabla CALENDARIO */
CREATE TABLE Calendario(
	Id SERIAL PRIMARY KEY,
	Fecha DATE NOT NULL,
	IdTipo INT NOT NULL,
	CONSTRAINT fkCalendario_IdTipo FOREIGN KEY (IdTipo)
		REFERENCES Tipo(Id),
	Descripcion VARCHAR(200) NULL
);

CREATE UNIQUE INDEX ixCalendario_Fecha ON Calendario(Fecha);

/* Crear tabla USUARIO */
CREATE TABLE Usuario(
	Id SERIAL PRIMARY KEY,
	Usuario VARCHAR(100) NOT NULL,
	Nombre VARCHAR(100) NOT NULL,
	Clave VARCHAR(100) NOT NULL,
	Activo BOOL DEFAULT(true) NOT NULL,
	Foto BYTEA NULL,
	Roles VARCHAR(100) NULL
);

CREATE UNIQUE INDEX ixUsuario_Usuario ON Usuario(Usuario);

/* Datos iniciales de Tipo */
INSERT INTO Tipo (Id, Tipo) VALUES (1, 'Día laboral');
INSERT INTO Tipo (Id, Tipo) VALUES (2, 'Fin de semana');
INSERT INTO Tipo (Id, Tipo) VALUES (3, 'Día festivo');

/* Usuarios iniciales para JWT */
INSERT INTO Usuario (Usuario, Nombre, Clave, Activo, Roles)
	VALUES ('admin', 'Administrador', 'admin123', true, 'ADMIN');
INSERT INTO Usuario (Usuario, Nombre, Clave, Activo, Roles)
	VALUES ('frayosorio', 'Fray León Osorio Rivera', '123', true, 'ADMIN');

/* Secuencias para Hibernate/JPA */
DO $$
DECLARE
    ultimoID INTEGER;
BEGIN
    SELECT COALESCE(MAX(id), 0) + 1 INTO ultimoID FROM Tipo;
    EXECUTE 'CREATE SEQUENCE secuencia_tipo START ' || ultimoID;

    SELECT COALESCE(MAX(id), 0) + 1 INTO ultimoID FROM Calendario;
    EXECUTE 'CREATE SEQUENCE secuencia_calendario START ' || ultimoID;

    SELECT COALESCE(MAX(id), 0) + 1 INTO ultimoID FROM Usuario;
    EXECUTE 'CREATE SEQUENCE secuencia_usuario START ' || ultimoID;
END $$;
