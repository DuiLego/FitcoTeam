import { LOADER } from './types'

export const changeLoader = show => dispatch => {
    if (show) {
        dispatch({
            type: LOADER.SHOW,
            payload: {}
        });
    } else {
        dispatch({
            type: LOADER.HIDE,
            payload: {}
        });
    }
}