const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['admin', 'coordinador', 'auxiliar'] }]
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hook pre-save
UserSchema.pre('save', async function (next) {
    // Solo hashear la contraseña si ha sido modificada
    if (!this.isModified('password')) return next(); // Pasar a next() solo si no se modificó la contraseña

    try {
        console.log('Contraseña antes de hashear: ', this.password);
        // Generar salt
        const salt = await bcrypt.genSalt(12);
        // Hashear la contraseña
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Contraseña hasheada: ', this.password);
        
        // Después de hashear la contraseña, pasar al siguiente middleware
        next();
    } catch (err) {
        console.error('Error al hashear: ', err);
        next(err); // Pasar el error al siguiente middleware en caso de fallo
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
