import { LOADER } from '../actions/types'

const initialState = false;

export default (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case LOADER.SHOW:
            return true;

        case LOADER.HIDE:
            return false;

        default:
            return state;
    }
}