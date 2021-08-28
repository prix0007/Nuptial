import {
    SET_CID,
    SET_SECRET,
    SET_SHARDS,
    REMOVE_CID,
    REMOVE_SECRET,
    REMOVE_SHARDS,
  } from "./types";
  
  const initState = {
    secret: "",
    shards: [],
    cid: [],
    formState: null
  };
  
  const setObj = (curState, objKey, newObjVal) => {
    return {
      ...curState,
      [objKey]: newObjVal,
    };
  };
  
  const removeObj = (curState, objKey) => {
      return {
          ...curState,
          [objKey]: null
      }
  }
  
  const global = (state = initState, action) => {
    switch (action.type) {
      case SET_CID:
        return setObj(state, "cid", [action.payload]);
      case SET_SECRET:
        return setObj(state, "secret", action.payload);
      case SET_SHARDS:
        return setObj(state, "shards", [...action.payload]);
      case REMOVE_CID:
          return removeObj(state, "cid");
      case REMOVE_SECRET:
          return removeObj(state, "secret");
      case REMOVE_SHARDS:
          return removeObj(state, "shards");
      default:
        return state;
    }
  };
  
  export default global;
  