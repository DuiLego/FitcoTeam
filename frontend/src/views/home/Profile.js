import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { setAlert } from '../../actions/alert';
import { showProfile, editProfile } from '../../actions/home';

const Profile = () => {

    const dispatch =  useDispatch();

    const { user } = useSelector(state => state.auth);
    const { profile_window } = useSelector(state => state.home);

    const [statusProcesar, setStatusProcesar] = useState(false);

    const [profileData, setProfileData] = useState({
        name: null,
        email: null,
        username: null,
        password: null, 
        image: null
    });

    const [profilePicture, setProfilePicture] = useState({
        img: undefined,
    });

    let img = createRef();

    const handleAbrir = () => {
        if(user){
            setProfileData({
                name: user.name,
                email: user.email,
                username: user.username,
                password: null, 
                image: user?.url || process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/avatar.png'
            });
        }
    }

    const handleChangeImg = () => {
        setProfilePicture({
            ...profilePicture, img: img.current.files[0]
        })
    }

    const handleInputChange = ({ target }) => {
        setProfileData({
            ...profileData,
            [target.name]: target.value
        });
    }

    const onViewPassword = (origen) => {
        let loginInputType = document.getElementById(origen).type;
        
        if(loginInputType == 'password')document.getElementById(origen).type = 'text';
        else document.getElementById(origen).type = 'password';
    }
    
    const handleProcesar = async () => {
        if(profileData.name && profileData.email && profileData.username){
            let formData = new FormData();

            formData.append('name', profileData.name);
            formData.append('email', profileData.email);
            formData.append('username', profileData.username);
            formData.append('password', profileData.password);
            formData.append('profile', profilePicture.img);

            await setStatusProcesar(true);
            await dispatch(editProfile(formData));
            await handleCerrar();
            await setStatusProcesar(false);
        }else{
            dispatch(setAlert('El nombre, email y usuario son requeridos', 'danger'));
        }
    }

    const handleCerrar = () => {
        if(!statusProcesar){
            setProfileData({
                name: null,
                email: null,
                username: null,
                password: null
            });

            dispatch(showProfile(false));
        }
    }

    useEffect(() => {
        if(user){
            console.log(user);
            setProfileData({
                name: user.name,
                email: user.email,
                username: user.username,
                password: null, 
                image: user?.url || process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/avatar.png'
            });
        }
    }, [user]);

    return (
        <Modal show={profile_window} size="lg" backdrop="static" centered onEntered={() => handleAbrir()} onHide={() => handleCerrar()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 form-group text-center">
                        <label htmlFor="photo-upload" className="custom-file-upload fas">
                            <div className="img-wrap img-upload">
                                <img id="img-photo" htmlFor="photo-upload" src={profilePicture.img ? URL.createObjectURL(profilePicture.img) : profileData.image}/>
                            </div>
                            <input id="photo-upload" type="file" accept="image/*" ref={img} onChange={handleChangeImg}/> 
                        </label>
                    </div>

                    <div className="col-md-6 form-group mb-3">
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="text" className="form-control" placeholder="Nombre" id="name" name="name" value={profileData.name} onChange={e => handleInputChange(e)} />
                                <label htmlFor="name">Nombre</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 form-group mb-3">
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="text" className="form-control" placeholder="Email" id="email" name="email" value={profileData.email} onChange={e => handleInputChange(e)} />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 form-group mb-3">
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="text" className="form-control" placeholder="Usuario" id="username" name="username" value={profileData.username} onChange={e => handleInputChange(e)} />
                                <label htmlFor="username">Usuario</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 form-group mb-3">
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="password" id="password" className="form-control" placeholder="Contraseña" name="password" value={profileData.password || ''} onChange={e => handleInputChange(e)}></input>
                                <label htmlFor="password">Contraseña</label>
                            </div>
                            <div className="input-group-append">
                                <button className="btn btn-primary view-password" onClick={() => onViewPassword('password')}><i className="fa-solid fa-eye"></i></button>
                            </div>
                        </div>
                    </div>
                </div>                    
            </Modal.Body>
            <Modal.Footer>
                {
                    statusProcesar ?
                        <>
                            <button type="button" className="btn btn-danger" disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cancelar</button>
                            <button type="button" className="btn btn-success" disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardar</button>
                        </>
                    :
                        <>
                            <button type="button" className="btn btn-danger" onClick={() => handleCerrar()}><i className="fas fa-times fa-sm"></i> Cancelar</button>
                            <button type="button" className="btn btn-success" onClick={() => handleProcesar()}><i className="fas fa-check fa-sm"></i> Guardar</button>
                        </>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default Profile;