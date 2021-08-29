import { combineReducers } from 'redux'
import global from './global';
import notifications from './notification';
import ownCertificate from './ownCertificate';

export default combineReducers({
  global,
  notifications,
  ownCertificate
})
