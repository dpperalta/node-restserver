const express = require('express');

const { verificaToken } = require('../middleware/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =================================
//   Mostrar todos los Productos
// =================================
app.get('/producto', verificaToken, (req, res) => {
    //Obtener todos los productos
    //populate: usuario y categoría
    //paginar
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.liminte || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            });
        });
});

// =================================
//   Mostrar Producto por ID
// =================================
app.get('/producto/:id', (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No se ha encontrado el producto, el ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

// =================================
//   Buscar un producto
// =================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoBuscado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBuscado
            })
        });
});

// =================================
//   Buscar dados de baja
// =================================
app.get('/productos/baja', verificaToken, (req, res) => {

    Producto.find({ disponible: false })
        .populate('categoria', 'descripcion')
        .exec((err, productoBuscado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBuscado
            })
        });
});

// =================================
//   Crear un nuevo producto
// =================================
app.post('/producto', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoría
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
});

// =================================
//   Actualizar un producto
// =================================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }
    Producto.findByIdAndUpdate(id, producto, { new: true, runValidator: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID ingresado no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });

});

// =================================
//   Eliminado Lógico de un producto
// =================================
app.delete('/producto/:id', verificaToken, function(req, res) {
    //desactivar un producto
    let id = req.params.id;
    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                erro: {
                    message: 'No se ha encontrado el producto seleccionado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto eliminado satisfactoriamente'
        })
    });
});


module.exports = app;