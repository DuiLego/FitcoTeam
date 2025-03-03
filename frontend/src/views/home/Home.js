import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { MessageList, MessageBox } from 'react-chat-elements';
import "react-chat-elements/dist/main.css"

import { setAlert } from '../../actions/alert';
import { logout, modifyUser } from '../../actions/auth';
import { showProfile, getMessages } from '../../actions/home';

import Profile from './Profile';

const socket = io(process.env.REACT_APP_API_ROUTE);

const Home = () => {
    const dispatch = useDispatch();

    const { user, user_modified } = useSelector(state => state.auth);
    const { messages } = useSelector(state => state.home);

    const [conversationData, setConversationData] = useState([]);

    const [messageData, setMessageData] = useState({
        message: ''
    });

    const containerRef = useRef(null);

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
        dispatch(getMessages());
    }, []);

    useEffect(() => {
        if (user) {
            socket.on('receiveMessage', (message) => {
                setConversationData((previousMessages) => {
                    const message_exists = previousMessages.some(current => current.id == message.id);
    
                    if (!message_exists) {
                        return [...previousMessages, {
                            ...message,
                            position: message.user.id === user.id ? 'right' : 'left',
                        }];
                    }

                    return previousMessages;
                });
            });

            socket.on('modifyMessages', (user) => {
                setConversationData((previousMessages) => {
                    const updatedMessages = previousMessages.map((current) => {
                        if (current.user.id == user.id) {
                            console.log(user);
                            return {
                                ...current,
                                user: user,
                                title: user.name,
                                avatar: user.avatar
                            };
                        }

                        return current;
                    });

                    console.log(updatedMessages);
            
                    return updatedMessages;
                });
            });            
    
            socket.emit('register', user);
        }
    }, [user]);

    useEffect(() => {
        if(messages){
            setConversationData(messages);
        }
    }, [messages]);

    useEffect(() => {
        if (user_modified) {    
            socket.emit('changeUser', user_modified);

            dispatch(modifyUser(null));
        }
    }, [user_modified]);

    useEffect(() => {
        if(containerRef && containerRef.current){
            const element = containerRef.current;
            element.scroll({
                top: element.scrollHeight,
                left: 0,
                behavior: "smooth"
            });
        }
    }, [containerRef, conversationData, messages]);

    return (
        <Fragment>

            <Profile />

            <div className="general_chat">
                <div className="chat_container">
                    <div className="conversations_section">
                        <div className="profile_conversation">
                            <div className="col-md-12 px-0 row mx-0 h-100 d-flex flex-column justify-content-between">
                                <div className="col-md-12 py-4 text-center">
                                    <label className="image_profile_container">
                                        <div className="image_container">
                                            <img id="profile_image" src={user?.avatar || process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/avatar.png'} />
                                        </div>
                                    </label>                                    
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

                                <div className="col-md-12 text-center mt-auto">
                                    <img id="logo_image" src={process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/logo-color.png'} />
                                    <div className="mt-3 mb-5 d-flex justify-content-center">
                                        <Link className="btn btn-danger mx-1" onClick={logOut} to="/"><i className="fa-solid fa-right-from-bracket"></i> Salir</Link>

                                        <button className="btn btn-primary mx-1" type="button" onClick={editProfile}><i className="fa-solid fa-user-gear"></i> Editar perfil</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="conversation_section">
                        <div className="conversation_container">

                            <div className="conversation_body" ref={containerRef}>
                                {
                                    conversationData?.map((message) => (
                                        <MessageBox
                                            key={message.id}
                                            id={message.id}
                                            user={message.user}
                                            position={message.position}
                                            type={message.type}
                                            title={message.user.name}
                                            text={message.text}
                                            date={message.date}
                                            avatar={message.user.id != user?.id ? (message.user.avatar || process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/avatar.png') : null}
                                        />
                                    ))
                                }
                            </div>
                            
                            <div className="footer_conversation">
                                <div className="send_field_container">
                                    <input className="form-control field_send" type="text" placeholder="Escribe aquí..." onChange={e => onChangeMessage(e)} onKeyDown={handleKeyPress} value={messageData.message} />
                                    <button className="btn btn-success button_send" type="button" onClick={handleSendMessage}><i className="fa-solid fa-paper-plane"></i> Enviar</button>
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