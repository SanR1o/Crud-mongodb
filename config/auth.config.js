module.exports ={
    secret: process.env.JWT_SECRET || 
    'tu_clave_secreta_para_desarrollo',
    jwtExpiration: procces.env.JWT_SECRET || '24h'
};
