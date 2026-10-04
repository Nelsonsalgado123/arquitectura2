--Ejecutar solo si se va a reemplazar la base de datos
DROP DATABASE IF EXISTS calendario WITH (FORCE);

--Ejecutar primero
CREATE DATABASE calendario;

--Se debe Cambiar la conexión a la BD "calendario" para los siguientes comandos

/* ===================== DDL ===================== */

/* Crear tabla TIPO */
CREATE TABLE Tipo(
	Id SERIAL PRIMARY KEY,
	Tipo VARCHAR(100) NOT NULL
	);

/* Crear indice para TIPO
	ordenado por TIPO */
CREATE UNIQUE INDEX ixTipo
	ON Tipo(Tipo);

/* Crear tabla CALENDARIO */
CREATE TABLE Calendario(
	Id SERIAL PRIMARY KEY,
	Fecha DATE NOT NULL,
	IdTipo INT NOT NULL,
	CONSTRAINT fkCalendario_IdTipo FOREIGN KEY (IdTipo)
		REFERENCES Tipo(Id),
	Descripcion VARCHAR(100) NULL
	);

/* Crear indice para CALENDARIO
	ordenado por FECHA (un registro por día) */
CREATE UNIQUE INDEX ixCalendario_Fecha
	ON Calendario(Fecha);

/* Crear tabla USUARIO (seguridad - Examen 4) */
CREATE TABLE Usuario(
	Id SERIAL PRIMARY KEY,
	Usuario VARCHAR(100) NOT NULL,
	Nombre VARCHAR(100) NOT NULL,
	Clave VARCHAR(100) NOT NULL,
	Activo BOOL DEFAULT(true) NOT NULL,
	Foto BYTEA NULL,
	Roles VARCHAR(100) NULL
	);

/* Crear indice para USUARIO
	ordenado por USUARIO */
CREATE UNIQUE INDEX ixUsuario_Usuario
	ON Usuario(Usuario);

/* ===================== DML (datos de prueba) ===================== */

/* Tipos de día según el Taller */
INSERT INTO Tipo (Id, Tipo) VALUES (1, 'Día laboral');
INSERT INTO Tipo (Id, Tipo) VALUES (2, 'Fin de semana');
INSERT INTO Tipo (Id, Tipo) VALUES (3, 'Día festivo');
SELECT setval('tipo_id_seq', (SELECT MAX(Id) FROM Tipo));

/* Ejemplos de Calendario (1: Laboral, 2: Fin de semana, 3: Festivo) */
INSERT INTO Calendario (Fecha, IdTipo, Descripcion) VALUES ('2023-01-01', 3, 'Año nuevo');
INSERT INTO Calendario (Fecha, IdTipo, Descripcion) VALUES ('2023-01-02', 1, 'Lunes');
INSERT INTO Calendario (Fecha, IdTipo, Descripcion) VALUES ('2023-01-07', 2, 'Sábado');
INSERT INTO Calendario (Fecha, IdTipo, Descripcion) VALUES ('2023-01-08', 2, 'Domingo');
INSERT INTO Calendario (Fecha, IdTipo, Descripcion) VALUES ('2023-01-09', 3, 'Santos Reyes');

/* Usuario de prueba (clave en texto plano solo para test; en el Examen 4 se cifrará con BCrypt) */
INSERT INTO Usuario (Usuario, Nombre, Clave, Activo, Roles)
	VALUES ('admin', 'Administrador', 'admin123', true, 'ADMIN');
