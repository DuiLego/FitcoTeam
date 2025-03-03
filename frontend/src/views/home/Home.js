import React, { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageList } from 'react-chat-elements';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import { setAlert } from '../../actions/alert';
import { logout } from '../../actions/auth';
import { showProfile } from '../../actions/home';

import Profile from './Profile';

const socket = io(process.env.REACT_APP_API_ROUTE);

const Home = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);

    const [messageData, setMessageData] = useState({
        message: ''
    });

    const logOut = () => {
        dispatch(logout());
    }

    const editProfile = () => {
        dispatch(showProfile(true));
    }

    /* Send messages */
    const onChangeMessage = (e) => {
        setMessageData({
            ...messageData, 
            message: e.target.value
        });
    }

    const handleKeyPress = (e) => {
        if(e.keyCode === 13){
            handleSendMessage();
        }
    }

    const handleSendMessage = async () => {
        if(messageData.message){
            /* await dispatch(createMensajeAsesoria(messageData)); */
            socket.emit('sendMessage', { user, messageData });

            await setMessageData({
                ...messageData, 
                message: ''
            });
        }else{
            dispatch(setAlert('No puedes mandar un mensaje vacio.', 'danger'));
        }
    }

    useEffect(() => {
        if(user){
            socket.emit('register', user);
        }
    }, [user]);

    return (
        <Fragment>

            <Profile />

            <div className="chat_general">
                <div className="contenedor_chat">
                    <div className="seccion_conversaciones">
                        <div className="perfil_conversacion">
                            <div className="col-md-12 px-0 row mx-0">
                                <div className="col-md-12 py-4 text-center">
                                    <label className="contenedor_imagen_perfil">
                                        <div className="contenedor_imagen">
                                            <img id="imagen_perfil" src={process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/avatar.png'} />
                                        </div>
                                    </label>

                                    <div className="mt-3 mb-5 d-flex justify-content-center">
                                        <Link className="btn btn-danger mx-1" onClick={logOut} to="/"><i className="fa-solid fa-right-from-bracket"></i> Salir</Link>

                                        <button className="btn btn-primary mx-1" type="button" onClick={editProfile}><i className="fa-solid fa-user-gear"></i> Editar perfil</button>
                                    </div>
                                </div>

                                <div className="col-md-12 text-center">
                                    <label className="fw-bold">Nombre</label>
                                    <p>{user ? user.name : 'Sin definir'}</p>
                                </div>

                                <div className="col-md-12 text-center">
                                    <label className="fw-bold">Usuario</label>
                                    <p>{user ? user.username : 'Sin definir'}</p>
                                </div>

                                <div className="col-md-12 text-center">
                                    <label className="fw-bold">Correo</label>
                                    <p>{user ? user.email : 'Sin definir'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="seccion_conversacion">
                        <div className="contenedor_conversacion">
                            <div className="header_conversacion">
                                <div className="contenedor_imagen_conversacion">
                                    <div className="imagen_conversacion"></div>
                                </div>
                                <div className="contenedor_datos_conversacion">
                                    <label className="titulo_conversacion">Nombre</label>
                                </div>
                            </div>

                            <div className="body_conversacion">
                                <MessageList
                                    id="chat" 
                                    className="message-list"
                                    lockable={true}
                                    toBottomHeight={'100%'}
                                    dataSource={[]}
                                />
                            </div>
                            
                            <div className="footer_conversacion">
                                <div className="contenedor_campo_envio">
                                    <input className="form-control campo_envio" type="text" placeholder="Escribe aquí..." onChange={e => onChangeMessage(e)} onKeyDown={handleKeyPress} value={messageData.message} />
                                    <button className="btn btn-success boton_envio" type="button" ><i className="fa-solid fa-paper-plane" onClick={handleSendMessage}></i> Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Home;