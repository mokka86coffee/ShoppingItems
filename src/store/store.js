import { createStore } from 'redux';

const reducer = (store={},action) => {
    switch (action.type) {
        case 'LOGGED IN': return { ...store, ...action.payload }; break;
        default: return store;
    }
}

export default createStore(reducer, {email: null});