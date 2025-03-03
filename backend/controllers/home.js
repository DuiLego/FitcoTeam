const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const path = require('path');

const { getList, uploadFile, getURL, deleteFile } = require('../helpers/files/files');

let { Messages, Users } = require('../models');

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

            if(req.files != null){
                if('profile' in req.files){
                    let url_profile_list = await getList({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Prefix: user.id + '/'
                    });
        
                    for(var i = 0; i < url_profile_list?.Contents?.length; i++){
                        await deleteFile({
                            Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                            Key: url_profile_list.Contents[i].Key,
                        });
                    }

                    let extension_file = path.extname(req.files.profile.name);

                    await uploadFile({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Key: user.id + '/' + 'profile' + extension_file,
                        Body: req.files.profile.data
                    });
                }
            }

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
                msg: 'Perfil editado correctamente.',
                user, 
                success: true
            });
        }else{
            if(req.files != null){
                if('profile' in req.files){
                    user = await Users.findOne({ where: { id: req.user.id } });

                    user = user.get({ plain: true });
                    delete user.password;

                    let url_profile_list = await getList({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Prefix: user.id + '/'
                    });
        
                    for(var i = 0; i < url_profile_list?.Contents?.length; i++){
                        await deleteFile({
                            Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                            Key: url_profile_list.Contents[i].Key,
                        });
                    }
                    
                    let extension_file = path.extname(req.files.profile.name);

                    await uploadFile({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Key: user.id + '/' + 'profile' + extension_file,
                        Body: req.files.profile.data
                    });

                    url_profile_list = await getList({
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
            }else{
                return res.status(400).json({
                    msg: 'El perfil no fue actualizado.',
                    success: false
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal, inténtalo más tarde.',
            success: false
        });
    }
}

const getMessages = async (req, res) => {
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

        let messages = await Messages.findAll({
            include: [
                {
                    model: Users,
                    as: 'sender', 
                    attributes: [
                        ['id', 'id'],
                        ['name', 'name']
                    ]
                }
            ],
            order: [
                ['date', 'ASC']
            ]
        });

        let users = new Map();

        let formated_messages = [];

        for(var i = 0; i < messages.length; i++){
            messages[i] = messages[i].get({ plain: true });

            if(messages[i].sender){
                let url_avatar = null;

                if (!users.has(messages[i].sender.id)) {
                    let url_profile_list = await getList({
                        Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                        Prefix: messages[i].sender.id + '/profile',
                    });
        
                    if(url_profile_list?.Contents.length > 0){
                        url_avatar = await getURL({
                            Bucket: process.env.AWS_S3_ENVIRONMENT + 'ft-users',
                            Key: url_profile_list?.Contents[0].Key
                        });
                    }

                    users.set(messages[i].sender.id, {
                        ...messages[i].sender, 
                        avatar: url_avatar
                    });
                }else{
                    let existing_user = users.get(messages[i].sender.id);

                    url_avatar = existing_user.avatar;
                }

                formated_messages.push({
                    id: messages[i].id, 
                    user: {
                        ...messages[i].sender,
                        avatar: url_avatar
                    }, 
                    position: messages[i].sender.id == req.user.id ? 'right' : 'left', 
                    type: 'text', 
                    title: messages[i].sender.name, 
                    text: messages[i].text, 
                    date: messages[i].date
                });
            }
        }

        return res.status(200).send({
            msg: 'Mensajes obtenidos correctamente.',
            messages: formated_messages, 
            success: true 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal, inténtalo más tarde.',
            success: false
        });
    }
}

const sendMessage = async ({user, messageData}) => {
    try {
        if(!messageData?.message){
            return {
                'success': false,
                'message': null
            };
        }

        if(!user?.id){
            return {
                'success': false,
                'message': null
            };
        }

        let message = await Messages.create({
            id_sender: user?.id, 
            text: messageData?.message, 
            date: new Date(),
        });

        if(message){
            message = message.get({ plain: true });

            return {
                'success': true,
                'message': {
                    'id': message.id,
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'avatar': user.avatar
                    },
                    'position': null,
                    'type': 'text',
                    'title': user.name, 
                    'text': message.text, 
                    'date': message.date, 
                    'avatar': user.avatar
                }
            };
        }else{
            return {
                'success': false,
                'message': null
            };
        }
    } catch (error) {
        return {
            'success': false,
            'message': null
        };
    }
}

module.exports = {
    editProfileValidation,

    editProfile, 
    getMessages, 
    sendMessage
};
