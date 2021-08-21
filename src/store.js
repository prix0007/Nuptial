import { createStore } from 'redux';

import global from './reducers/index';

const store = createStore(
    global,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;