-- Estudiantes de prueba
INSERT OR IGNORE INTO estudiantes (legajo, dni, nombre, carrera)
VALUES 
('12345', '11222333', 'Juan Pérez', 'Ingeniería Civil'),
('16670', '45937416', 'Milagros Vignolo', 'Ingeniería en Sistemas');

-- Códigos de verificación vinculados a estudiantes
INSERT OR IGNORE INTO verification_codes (estudiante_legajo, codigo)
VALUES
('12345', '654321'),
('16670', '123456');

-- Empresas de prueba
INSERT OR IGNORE INTO empresas (cuit, razon_social, password)
VALUES 
('30123456789', 'Empresa Tecnológica S.A.', NULL),
('30987654321', 'Consultora IT S.R.L.', NULL),
('33555666777', 'Desarrollo Software S.A.', NULL);

-- Datos de Sysacad
INSERT OR IGNORE INTO sysacad (legajo, carrera, materias_aprobadas, materias_regularizadas)
VALUES 
('12345', 'Ingeniería Civil', '["Análisis Matemático I", "Física I"]', '["Química"]'),
('16670', 'Ingeniería en Sistemas', '["Algoritmos y Estructuras de Datos", "Matemática Discreta"]', '["Arquitectura de Computadoras"]');

INSERT INTO personal_sau (nombre, apellido, dni) VALUES
('Ana', 'García', '11223344'),
('Carlos', 'Pérez', '22334455');

