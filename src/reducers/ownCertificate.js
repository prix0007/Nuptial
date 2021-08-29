import {
    SET_CERTIFICATE,
    REMOVE_CERTIFICATE
} from './types'

const initState = {
    bride: "",
    cid: "",
    created_on: "",
    groom: "",
    shard: ""
}

const ownCertificate = (state = initState, action) => {
    switch (action.type) {
      case SET_CERTIFICATE:
        return {
            ...action.payload
        };
      case REMOVE_CERTIFICATE:
        return {
            ...initState
        };
      
      default:
        return state;
    }
  };
  
  export default ownCertificate;
  