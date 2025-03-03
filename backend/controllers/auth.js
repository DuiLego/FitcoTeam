const jwt = require('jsonwebtoken');

let { Users } = require('../models');

const getAccount = async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(500).json({
            msg: 'Algo salió mal, inténtalo más tarde.',
            success: false
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded.user;

        if(!req.user){
            return res.status(400).send({  
                msg: 'Sesión no valida',
                success: false
            });
        }

        let user = await Users.findOne({ where: { id: req.user.id }, attributes: ['id', 'name', 'email', 'username'] });

        if(!user){
            return res.status(400).send({  
                msg: 'Usuario no encontrado.',
                success: false
            });
        }

        user = user.get({ plain: true });

        return res.status(200).json({
            user, 
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errors: [{ msg: 'Algo salió mal, inténtalo más tarde.' }],
            success: false
        });
    }
}

module.exports = {
    getAccount
};