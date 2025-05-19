module.exports = {
    secret: process.env.JWT_SECRET || 'tu_clave_secreta_para_desarrollo',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h'
};  