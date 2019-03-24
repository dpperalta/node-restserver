const jwt = require('jsonwebtoken');

// =========================================
//          VERIFICAR TOKEN
// =========================================
let verificaToken = (req, res, next) => {

    let token = req.get('token'); //Si se usa el header Authorization, se debe invocar al nombre adecuado

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// =========================================
//          VERIFICAR ADMIN_ROLE
// =========================================
let verifcaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es ADMINISTRADOR'
            }
        });
    }
    // if (!usuario.role === 'ADMIN_ROLE') {
    //     console.log('Entra al IF');
    //     return res.status(401).json({
    //         ok: false,
    //         err: {
    //             message: 'El usuario no es ADMINISTRADOR'
    //         }
    //     });
    // }
    // next();
};

// =========================================
//          VERIFICAR TOKEN POR URL
// =========================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verifcaAdmin_Role,
    verificaTokenImg
}