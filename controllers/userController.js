const db = require('../models/User');
const User = db.user;

exports.allAccess = (req, res) => {
    res.status(200).send("Contenido publico");
};

exports.userBoard = (req, res) => {
    res.status(200).send("Contenido de usuario");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Contenido de administrador");
};

exports.coordinadorBoard = (req, res) => {
    res.status(200).send("Contenido de coordinador");
};

exports.auxiliarBoard = (req, res) => {
    res.status(200).send("Contenido de auxiliar");
};

