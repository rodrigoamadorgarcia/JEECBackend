require('dotenv').config();
const mysql = require('mysql2');

const dbConfig = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
};

const db = mysql.createPool(dbConfig);

module.exports = db;

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
