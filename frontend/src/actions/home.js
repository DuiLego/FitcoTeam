import axios from 'axios';

import { AUTH, HOME } from './types';

import { setAlert } from './alert';

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
        const res = await axios.post(`${process.env.REACT_APP_API_ROUTE}/home/edit_profile`, profile, config);

        await dispatch({
            type: AUTH.SESSION,
            payload: res.data.user
        });

        await dispatch(setAlert(res.data.msg, 'success'));
    } catch (error) {
        if(error?.response?.data?.msg) {
            await dispatch(setAlert(error?.response?.data?.msg, 'danger'));
        }
    }
}