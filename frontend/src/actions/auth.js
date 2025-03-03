import axios from 'axios';

import setAuthToken from '../utils/setAuthToken';

import { AUTH } from './types';

// LOAD USER
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        const res = await axios.get(`${process.env.REACT_APP_API_ROUTE}/auth/session`);

        dispatch({
            type: AUTH.SESION,
            payload: res.data.user
        });
    } catch (error){         
        dispatch({
            type: AUTH.SESION_ERROR
        });
    }
}