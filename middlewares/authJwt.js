const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models/User');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send({message: 'No se proporciono token'});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: 'No autorizado'});
        }
        req.userId = decoded;
        next();
    });
};

isAdmin = (req, res, next) =>{
    User.findById(req.userId).exec((err, user) =>{
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        if(user.roles.includes('admin')){
            next();
            return;
        }

        res.status(403).send({message: 'Requiere rol de admin'});
    })
};

isCoordinador = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err){
            res.status(500).send({message: err});
            return;
        }

        if (user.roles.includes('coordinador')){
            next();
            return;
        }

        res.status(403).send({message: 'Requiere rol de coordinador'});
    });
};

isAuxiliar = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err){
            res.status(500).send({message: err});
            return;
        }

        if (user.roles.includes('auxiliar')){
            next();
            return;
        }

        res.status(403).send({message: 'Requiere rol de auxiliar'});
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isCoordinador,
    isAuxiliar
};

module.exports = {
    verifyToken,
    isAdmin,
    isCoordinador,
    isAuxiliar
};