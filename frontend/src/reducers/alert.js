import { ALERT } from '../actions/types'

const initialState = [];

export default (state = initialState, action) => {

    const { type, payload } = action;

    switch (type) {
        case ALERT.ADD:
            return [...state, payload];

        case ALERT.REMOVE:
            return state.filter( alert => alert.id !== payload.id );
            
        default:
            return state;
    }
}