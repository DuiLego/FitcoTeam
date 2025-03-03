import axios from 'axios';

import setAuthToken from '../utils/setAuthToken';

import { setAlert } from './alert';
import { changeLoader } from './loader';

import { AUTH } from './types';

export const login = (user) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(user);

    try {
        await dispatch(changeLoader(true));
        const res = await axios.post(`${process.env.REACT_APP_API_ROUTE}/auth/login`, body, config);
        await dispatch(changeLoader(false));

        dispatch({
            type: AUTH.LOGIN,
            payload: res.data
        });
    } catch (error) {
        await dispatch(changeLoader(false));

        if(error?.response?.data?.msg) {
            dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        }

        dispatch({
            type: AUTH.LOGIN_ERROR
        });
    }
}

export const signup = (user) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(user);

    try {
        await dispatch(changeLoader(true));
        const res = await axios.post(`${process.env.REACT_APP_API_ROUTE}/auth/signup`, body, config);
        await dispatch(changeLoader(false));

        dispatch({
            type: AUTH.SIGNUP,
            payload: res.data
        });
    } catch (error) {
        await dispatch(changeLoader(false));

        if(error?.response?.data?.msg) {
            dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        }

        dispatch({
            type: AUTH.SIGNUP_ERROR
        });
    }
}

export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        await dispatch(changeLoader(true));
        const res = await axios.get(`${process.env.REACT_APP_API_ROUTE}/auth/session`);
        await dispatch(changeLoader(false));

        dispatch({
            type: AUTH.SESSION,
            payload: res.data.user
        });
    } catch (error){   
        await dispatch(changeLoader(false));     

        dispatch({
            type: AUTH.SESSION_ERROR
        });
    }
}

export const modifyUser = (option) => dispatch => {
    dispatch({
        type: AUTH.MODIFY_USER,
        payload: option
    });
}

export const logout = () => dispatch => {
    dispatch({
        type: AUTH.LOGOUT
    });
}