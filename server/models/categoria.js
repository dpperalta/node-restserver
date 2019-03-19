const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: 'La {PATH} ya se encuentra registrada en la Base de Datos' });

module.exports = mongoose.model('Categoria', categoriaSchema);