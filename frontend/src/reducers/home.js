import { HOME } from '../actions/types';

const initialState = {
    messages: [],
    profile_window: false
};

export default (state = initialState, action) => {

    const { type, payload } = action;

    switch ( type ) {
        case HOME.FIND:
            return {
                ...state,
                messages: payload
            };

        case HOME.SHOW_PROFILE:
            return {
                ...state,
                profile_window: payload
            };
        
        default:
            return state;
    }
}