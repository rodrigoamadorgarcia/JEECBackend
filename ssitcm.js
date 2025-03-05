require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Necesario para Render
});

// Endpoint para registrar usuario
app.post('/usuarios/registrar', async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { nombre, edad } = req.body;

    if (!nombre || !edad) {
        return res.status(400).json({ message: "Nombre y edad son requeridos" });
    }

    try {
        const query = 'INSERT INTO usuarios (nombre, edad) VALUES ($1, $2) RETURNING *';
        const { rows } = await pool.query(query, [nombre, edad]);
        res.status(201).json({ message: "✅ Usuario registrado exitosamente", usuario: rows[0] });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error.message);
        res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
});

// Configurar el puerto para ejecutar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
