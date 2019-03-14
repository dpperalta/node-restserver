require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Parser to applicatrion/json -> Para leer en formato JSON los resultados HTML
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cargar las rutas del usuario
app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de Datos ONLINE en el puerto 27017');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});