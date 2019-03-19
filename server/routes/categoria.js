const express = require('express');

let { verificaToken, verifcaAdmin_Role } = require('../middleware/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =================================
//   Mostrar todas las Categorías
// =================================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion') //Se ordena por la descripción
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            });
        })
});

// =================================
//      Mostrar una Categoría
// =================================
app.get('/categoria/:id', (req, res) => {
    //Categoria.findById();   
    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado la categoría, el ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })
    });
});

// =================================
//      Crear nueva Categoría
// =================================
app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// =================================
//      Actualizar una Categoría
// =================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion //Se debe utilizar el nombre del campo que se enviará en el body
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidator: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

// =================================
//      Eliminar una Categoría
// =================================
app.delete('/categoria/:id', [verificaToken, verifcaAdmin_Role], (req, res) => {
    //Sólo un administrador puede borrar categorías
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se ha encontrado categoría'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada satisfactoriamente',
            categoria: categoriaBorrada
        });
    });
});


module.exports = app;