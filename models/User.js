const mongoose = require('mongoose');
const bycript =  require('bycriptjs');

const UserShema = new mongoose.Shema({
    username: {type: String, require:true, unique:true},
    email: {type: String, require:true, unique:true},
    password: {type: String, require:true},
    roles: [{type: String, enum:['admin','coordinador','auxiliar']}]
}, {
    timestamp:true,
    versionkey: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//hook pre-save
UserShema.pre('save', async function(next){
    //solo hashear password si fue modificado
    if (!this.isModified('password')) return
    next();

    try{
        console.log('Contraseña antes de hashear: ', this.password);
        const salt = await bcrypt.getSalt(12);
        this.password = await bycript.hash(this.password)
        console.log('Contraseña hasheada: ', this.password)
        next();
    } catch(err) {
        console.error('Error al hashear: ', err);
        next(err);
    } 
});

//metodo para comparar contraseñas
UserShema.methods.comparePassword = async function (candidiatePassword) {
    return await bcrypt.compare(candidiatePassword, this.password)
};

module.exports = mongoose.model('user', UserShema);
