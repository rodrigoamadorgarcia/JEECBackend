require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json()); // Permitir solicitudes JSON

// Configuración de la base de datos usando las variables de entorno
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

const db = mysql.createPool(dbConfig);

// Endpoint para registrar usuario
app.post('/usuarios/registrar', (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { nombre, age } = req.body;

    if (!nombre || !age) {
        return res.status(400).json({ message: "Nombre y edad son requeridos" });
    }

    const query = `INSERT INTO usuarios (nombre, edad) VALUES (?, ?)`;
    db.query(query, [nombre, age], (err, result) => {
        if (err) {
            console.error('❌ Error al registrar usuario:', err.message);
            return res.status(500).json({ message: "Error al registrar usuario", error: err.message });
        }
        res.status(201).json({ message: "✅ Usuario registrado exitosamente" });
    });
});

// Configurar el puerto para ejecutar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '::', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
