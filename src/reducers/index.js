import { combineReducers } from 'redux'
import global from './global';
import notifications from './notification';

export default combineReducers({
  global,
  notifications
})
