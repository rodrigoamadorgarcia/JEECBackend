require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Verificar conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err.message);
    } else {
        console.log('✅ Conectado a MySQL');
        connection.release();
    }
});

// Endpoint para registrar usuario
app.post('/usuarios/registrar', (req, res) => {
    const { nombre, edad, primer_periodo } = req.body;

    if (!nombre || !edad) {
        return res.status(400).json({ message: "Nombre y edad son requeridos" });
    }

    const query = `INSERT INTO usuarios (nombre, edad, primer_periodo) VALUES (?, ?, ?)`;
    db.query(query, [nombre, edad, primer_periodo || false], (err) => {
        if (err) {
            console.error('❌ Error al registrar usuario:', err.message);
            return res.status(500).json({ message: "Error al registrar usuario", error: err.message });
        }
        res.status(201).json({ message: "✅ Usuario registrado exitosamente" });
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
