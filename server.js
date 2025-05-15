require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Corregido
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());  // Corregido
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crud-mongodb2')  // Corregido
  .then(() => console.log('Ok conexión a MongoDB exitosa'))
  .catch(err => console.error('X Error de conexión a MongoDB:', err));

// Importación de rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');  // Corregido

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
