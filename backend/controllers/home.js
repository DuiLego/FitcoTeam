const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');

let { Users } = require('../models');

const editProfileValidation = [
    check('name', 'El nombre es requerido').exists(),
    check('email', 'El correo es requerido').exists(),
    check('username', 'El usuario es requerido').exists(),
    check('password', 'La contraseña es requerida').exists()
];

const editProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: errors.array()[0]?.msg,
            success: false
        })
    }

    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(500).json({
            msg: 'Algo salió mal, inténtalo más tarde.',
            success: false
        })
    }

    Object.keys(req.body).forEach(function(key) {
        if (req.body[key] == 'null' || req.body[key] == 'undefined') {
            req.body[key] = null;
        }
    });

    const {
        name, 
        email, 
        username, 
        password
    } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded.user;

        if(username){
            let duplicated_username = await Users.findOne({ where: { id: { [Op.ne]: req.user.id }, username } });

            if(duplicated_username){
                return res.status(400).json({
                    msg: 'Ya existe una cuenta registrada con este usuario.',
                    success: false
                });
            }
        }else{
            return res.status(400).json({
                msg: 'El usuario no puede esta vacio.',
                success: false
            });
        }

        if(email){
            let duplicated_email = await Users.findOne({ where: { id: { [Op.ne]: req.user.id }, email } });

            if(duplicated_email){
                return res.status(400).json({
                    msg: 'Ya existe una cuenta registrada con este email.',
                    success: false
                });
            }
        }else{
            return res.status(400).json({
                msg: 'El email no puede esta vacio.',
                success: false
            });
        }

        let modified_data = {
            name, 
            email, 
            username
        }

        if(password){
            const salt = await bcryptjs.genSaltSync(13);
            modified_data.password = await bcryptjs.hashSync(password, salt);
        }

        let [ user ] = await Users.update(
            modified_data,
            {
                where: {
                    id: req.user.id
                }
            }
        );

        if(user){
            user = await Users.findOne({ where: { id: req.user.id } });

            user = user.get({ plain: true });
            delete user.password;

            return res.status(200).json({
                msg: 'Perfil editado correctamente.',
                user, 
                success: true
            });
        }else{
            return res.status(400).json({
                msg: 'El perfil no fue actualizado.',
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal, inténtalo más tarde.',
            success: false
        });
    }
}

module.exports = {
    editProfileValidation,

    editProfile
};
