import { v4 as uuid } from 'uuid';

import { ALERT } from './types'

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid();

    dispatch({
        type: ALERT.ADD,
        payload: {
            id, 
            msg, 
            alertType
        }
    });

    setTimeout(() => {
        dispatch({
            type: ALERT.REMOVE,
            payload: {
                id
            }
        });
    }, timeout);
}
