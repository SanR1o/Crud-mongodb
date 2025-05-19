const User = require('../models/User')

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const user = await User.findOne ({
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        }).exec();

        if (user) {
            return res.status(400).json({message: 'Error Usuario o email ya existen'
            });
        }
        next();
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

const checkRolesExisted = (req, res, next) =>{
    if (req.body.roles) {
        const validRoles = ['admin','coordinador','auxiliar'];

        for (const role of req.body.roles){
            
            if(!validRoles.includes(role)){
                return res.status(400).send({
                    message: 'Error: el rol ${role} no existe'
                });
            }
        }
    }
};

//exportacion de objetos
module.exports={
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};