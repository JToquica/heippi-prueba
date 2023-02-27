const jwt = require('jsonwebtoken');

const generarJWT = (uid, tiempo = '4h') => {
    return new Promise((resolve) => {
        const payload = {uid};

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: tiempo
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token)
            }
        })
    });
}

module.exports = {
    generarJWT
};