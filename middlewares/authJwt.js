const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models/User');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']


    if (!token) {
        return res.status(403).sed({message: 'No se proporciono token'});
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
    User.findById(req,userId).exec((err, user) =>{
        if (err) {
            res.status(500).send({message: err});
            return;
        }


        if(user.roles.include('admin')){
            next();
            return;
        }

        res.status(403).send({message: 'requiere rol admin'});
    })
};