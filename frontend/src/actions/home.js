import axios from 'axios';

import { AUTH, HOME } from './types';

import { setAlert } from './alert';
import { changeLoader } from './loader';

export const showProfile = (option) => dispatch => {
    dispatch({
        type: HOME.SHOW_PROFILE,
        payload: option
    });
}

export const editProfile = (profile) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }

    try {
        await dispatch(changeLoader(true));
        const res = await axios.post(`${process.env.REACT_APP_API_ROUTE}/home/edit_profile`, profile, config);
        await dispatch(changeLoader(false));

        await dispatch({
            type: AUTH.SESSION,
            payload: res.data.user
        });

        await dispatch({
            type: AUTH.MODIFY_USER,
            payload: res.data.user
        });

        await dispatch(setAlert(res.data.msg, 'success'));
    } catch (error) {
        await dispatch(changeLoader(false));

        if(error?.response?.data?.msg) {
            await dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        }
    }
}

export const getMessages = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try{
        await dispatch(changeLoader(true));
        const res = await axios.get(`${process.env.REACT_APP_API_ROUTE}/home/messages`, config);
        await dispatch(changeLoader(false));

        await dispatch({
            type: HOME.FIND,
            payload: res.data.messages
        });
    } catch (error){ 
        await dispatch(changeLoader(false));

        if(error?.response?.data?.msg) {
            await dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        }
    }
}