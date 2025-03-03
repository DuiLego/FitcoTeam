import axios from 'axios';

import setAuthToken from '../utils/setAuthToken';

import { AUTH } from './types';

// LOGIN USER
export const login = (usuario) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(usuario);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_ROUTE}/auth/login`, body, config);

        dispatch({
            type: AUTH.LOGIN,
            payload: res.data
        });
    } catch (error) {
        /* if(error?.response?.data?.msg) {
            dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        } */

        dispatch({
            type: AUTH.LOGIN_ERROR
        });
    }
}

// LOAD USER
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        const res = await axios.get(`${process.env.REACT_APP_API_ROUTE}/auth/session`);

        dispatch({
            type: AUTH.SESSION,
            payload: res.data.user
        });
    } catch (error){         
        dispatch({
            type: AUTH.SESSION_ERROR
        });
    }
}