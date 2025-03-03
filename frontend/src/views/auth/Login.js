import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { login } from '../../actions/auth';

const Login = () => {

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(state => state.auth);

    const [loginData, setLoginData] = useState({
        username: null,
        password: null
    });

    /* Login */
    const onChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const onViewPassword = (origen) => {
        let loginInputType = document.getElementById(origen).type;
        
        if(loginInputType == 'password')document.getElementById(origen).type = 'text';
        else document.getElementById(origen).type = 'password';
    }

    const submitLogin = () => {
        dispatch(login(loginData));
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
                                    <h5 className="card-title">Iniciar sesión</h5>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" placeholder="Usuario" id="username" name="username" value={loginData.username || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="username">Usuario</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="form-floating">
                                            <input type="password" id="password" className="form-control" placeholder="Contraseña" name="password" value={loginData.password || ''} onChange={e => onChange(e)}></input>
                                            <label htmlFor="password">Contraseña</label>
                                        </div>
                                        <div className="input-group-append">
                                            <button className="btn btn-primary view-password" onClick={() => onViewPassword('password')}><i className="fa-solid fa-eye"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 form-group text-center">
                                    <Link className="btn btn-link text-secondary" to="/signup">¿No tienes una cuenta aún? Registrate aquí</Link>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mt-3 text-center">
                                        <button type="button" className="btn btn-primary w-100" onClick={() => submitLogin()}>Iniciar sesión</button>
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

export default Login;