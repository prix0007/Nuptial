import {
  SET_CID,
  SET_DECRYPTED_OBJS,
  SET_SECRET,
  SET_SHARDS,
  REMOVE_CID,
  REMOVE_DECTYPTED_OBJS,
  REMOVE_SECRET,
  REMOVE_SHARDS,
} from "../reducers/types";

export const setCid = (cid) => {
  return {
    type: SET_CID,
    payload: cid,
  };
};
export const setDecryptedObjs = (decryptedObjs) => {
  return {
    type: SET_DECRYPTED_OBJS,
    payload: decryptedObjs,
  };
};
export const setSecret = (secret) => {
  return {
    type: SET_SECRET,
    payload: secret,
  };
};
export const setShards = (shards) => {
  return {
    type: SET_SHARDS,
    payload: shards,
  };
};

export const removeCid = () => {
    return {
        type: REMOVE_CID,
    }
}
export const removeDecryptedObjs = () => {
    return {
        type: REMOVE_DECTYPTED_OBJS
    }
}
export const removeSecret = () => {
    return {
        type: REMOVE_SECRET,
    }
}
export const removeShards = () => {
    return {
        type: REMOVE_SHARDS,
    }
}