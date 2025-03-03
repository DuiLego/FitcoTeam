import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { signup } from '../../actions/auth';

const Signup = () => {

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(state => state.auth);

    const [signupData, setSignupData] = useState({
        name: null,
        email: null,
        username: null,
        password: null
    });

    /* Sign Up */
    const onChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        })
    }

    const onViewPassword = (origen) => {
        let signupInputType = document.getElementById(origen).type;
        
        if(signupInputType == 'password')document.getElementById(origen).type = 'text';
        else document.getElementById(origen).type = 'password';
    }

    const submitSignup = () => {
        dispatch(signup(signupData));
    }

    useEffect(() => {
        if(isAuthenticated){
            window.location.href = '/home';
        }
    }, [isAuthenticated]);

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-6 offset-md-3 centrado-vertical">
                    <div className="card bg-light"> 
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 text-center mb-3">
                                    <img src={process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/logo-color.png'} className="d-inline-block mt-2 mb-4 logo-header" alt="logo"/>
                                    <h5 className="card-title">Crear cuenta</h5>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" placeholder="Nombre" id="name" name="name" value={signupData.name || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="name">Nombre</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" placeholder="Email" id="email" name="email" value={signupData.email || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" placeholder="Usuario" id="username" name="username" value={signupData.username || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="username">Usuario</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="password" id="password" className="form-control" placeholder="Contraseña" name="password" value={signupData.password || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="password">Contraseña</label>
                                        </div>
                                        <div className="input-group-append">
                                            <button className="btn btn-success view-password" onClick={() => onViewPassword('password')}><i className="fa-solid fa-eye"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group text-center">
                                    <Link className="btn btn-link text-secondary" to="/login">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mt-3 text-center">
                                        <button type="button" className="btn btn-success w-100" onClick={() => submitSignup()}>Crear cuenta</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Signup;