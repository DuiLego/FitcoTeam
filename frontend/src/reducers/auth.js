import { AUTH } from '../actions/types';

import setAuthToken from '../utils/setAuthToken';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case AUTH.LOGIN:
        case AUTH.SIGNUP:
            localStorage.setItem('token', payload.token); 
            setAuthToken(localStorage.token);

            return {
                ...state, 
                ...payload,
                isAuthenticated: true
            };

        case AUTH.LOGIN_ERROR:
        case AUTH.SIGNUP_ERROR:
        case AUTH.SESSION_ERROR: 
        case AUTH.LOGOUT: 
            localStorage.removeItem('token');
            
            return {
                ...state,
                token: null,
                isAuthenticated: false
            };

        case AUTH.SESSION:
            return {
                ...state,
                isAuthenticated: true,
                user: payload
            };

        default:
            return state;
    }
}