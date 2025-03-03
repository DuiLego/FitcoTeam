const jwt = require('jsonwebtoken');

let Users = require('../models/users');

module.exports = async(req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Sesión caducada.'
        })
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded.user;

        const user = await Users.findOne({ where: { id: req.user.id } });

        if(user){
            next();
        }else{
            return res.status(401).json({
                msg: 'Acceso denegado.'
            });
        }
    } catch (error) {
        return res.status(401).json({
            msg: 'Sesión caducada.'
        });
    }
}