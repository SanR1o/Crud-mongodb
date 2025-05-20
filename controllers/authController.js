const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

//función de registro
exports.signup = async (req, res) => {
    try{
        const {username, email, password } = req.body;
        //validacion
        if (!username || !email || !password){
            return res.status(400).json({message: 
                'Se requieren todos los campos'});
        }
        //crear usuario sin hashear, el modelo lo hace solo
        const user = new User ({
            username,
            email,
            password, // se hashea automaticamente
            roles: req.body.roles || ['auxiliar']
        });
        //guardar usuario
        await user.save();
        //generar token
        const token  = jwt.sign(
            {id: user._id},
            config.secret,
            {expiresIn: config.jwtExpiration}
        );
        //preparar respuesta
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            accessToken: token
        });
    } catch (error) {
        console.error('Error de registro: ', error);
        res.status(500).json({
            succes:false,
            message: 'error',
            error: error.message
        });
    }
};

//funcion de login
exports.signin = async (req, res) =>{
    try{
        const{username, password} = req.body;
        console.log('intento de login para: ', username, 'con pw: ', password);

        const user = await User.findOne({username}).select('+password');

        if(!user){
            console.log('usuario no encontrado en DB');
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        //debug: mostrar hash almacenado
        console.log('Hash almacenado: ', user.password);

        //comparacion con bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Resultado comparacion', isMatch);

        if (!isMatch){
            //debug para recrear al hash
            const testHash = await bcrypt.hash(password, user.password.substring(0,29));
            console.log('Hash recalculado', testHash);
            console.log('coincide con el almacenado?', testHash === user.password);

            return res.status(401).json({
                success: false,
                accessToken: null,
                message:'credenciales invalidas'
            })
        }

        //generar token JWT
        const token =jwt.sign({
            id: user._id,
            username: user.username,
            roles: user.roles
        },
        config.secret,
        {expiresIn: config.jwtExpiration}
    );
    
    res.status(200).json({
        success: true,
        Message:'inicio de sesion exitoso',
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles
        },
        accessToken: token,
    });
    } catch (error) {
        console.error('Error en el login: ', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

