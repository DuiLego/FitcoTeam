const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const { getList, getURL } = require('../helpers/files/files');

let { Users } = require('../models');

const loginAccountValidation = [
    check('username', 'El usuario es requerido.').exists(),
    check('password', 'La contraseña es requerida.').exists()
];
const signupAccountValidation = [
    check('name', 'El nombre es requerido.').exists(),
    check('email', 'El email es requerido.').exists(),
    check('username', 'El usuario es requerido.').exists(),
    check('password', 'La contraseña es requerida.').exists()
];

const loginAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: errors.array()[0]?.msg,
            success: false
        })
    }

    Object.keys(req.body).forEach(function(key) {
        if (req.body[key] == 'null' || req.body[key] == 'undefined') {
            req.body[key] = null;
        }
    });

    let {
        username, 
        password
    } = req.body;

    try {
        if(!username){
            return res.status(400).send({  
                msg: 'El usuario es necesario.',
                success: false
            });
        }
        
        let user = await Users.findOne({ where: { username } });

        if(!user){
            return res.status(400).send({  
                msg: 'El usuario no pertenece a ninguna cuenta.',
                success: false
            });
        }

        user = user.get({ plain: true });

        if(bcryptjs.compareSync(password, user.password)){
            jwt.sign({
                user, 
            }, process.env.TOKEN_SECRET, { expiresIn: '24h' }, async (error, token) => {
                if (error) throw error;

                delete user.password;

                let url_profile_list = await getList({
                    Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                    Prefix: user.id + '/profile',
                });
        
                user.avatar = null;
        
                if(url_profile_list?.Contents.length > 0){
                    user.avatar = await getURL({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Key: url_profile_list?.Contents[0].Key
                    });
                }

                return res.status(200).send({  
                    msg: 'Sesión iniciada correctamente.',
                    token,
                    user,
                    success: true
                });
            });
        }else{
            return res.status(400).send({  
                msg: 'Usuario o contraseña incorrectos.',
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

const signupAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: errors.array()[0]?.msg,
            success: false
        })
    }

    Object.keys(req.body).forEach(function(key) {
        if (req.body[key] == 'null' || req.body[key] == 'undefined') {
            req.body[key] = null;
        }
    });

    let {
        name, 
        email, 
        username, 
        password
    } = req.body;

    try {
        if(!username){
            return res.status(400).send({  
                msg: 'El usuario es necesario.',
                success: false
            });
        }
        
        let user = await Users.findOne({ where: { username } });

        if(user){
            return res.status(400).send({  
                msg: 'El usuario ya pertenece a una cuenta.',
                success: false
            });
        }

        user = await Users.findOne({ where: { email } });

        if(user){
            return res.status(400).send({  
                msg: 'El correo ya pertenece a una cuenta.',
                success: false
            });
        }

        let register_data = {
            name, 
            email, 
            username, 
        };

        if(password){
            const salt = await bcryptjs.genSaltSync(13);
            register_data.password = await bcryptjs.hashSync(password, salt);
        }else{
            return res.status(400).send({  
                msg: 'La contraseña es necesaria.',
                success: false
            });
        }

        user = await Users.create(register_data);

        if(!user){
            return res.status(400).send({  
                msg: 'La cuenta no pudo ser creada.',
                success: false
            });
        }else{
            user = user.get({ plain: true });
            delete user.password;

            jwt.sign({
                user, 
            }, process.env.TOKEN_SECRET, { expiresIn: '24h' }, async (error, token) => {
                if (error) throw error;

                user.avatar = null;

                return res.status(200).send({ 
                    msg: 'Cuenta creada correctamente.',
                    token,
                    user,
                    success: true
                });
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

        let url_profile_list = await getList({
            Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
            Prefix: user.id + '/profile',
        });

        user.avatar = null;

        if(url_profile_list?.Contents.length > 0){
            user.avatar = await getURL({
                Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                Key: url_profile_list?.Contents[0].Key
            });
        }

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
    loginAccountValidation, 
    signupAccountValidation, 

    loginAccount, 
    signupAccount, 
    getAccount
};