
import AES from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";

import secrets from "@skyekiwi/secrets";

import { fetchCid, storeData } from "./db";

const fileTobase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

export const createZip = async (files, secret) => {
  var i;
  const finalObjJSON = {};
  for (i = 0; i < files["length"]; ++i) {
    console.log(files[i].name);
    finalObjJSON[files[i].name] = await fileTobase64(files[i]);
  }
  console.log(finalObjJSON);
  console.log("Encryting with key: ", secret)
  const encJSONData = await AES.encrypt(
    JSON.stringify(finalObjJSON),
    secret
  ).toString();
  console.log("Encrypted Base64 JSON Obj: ", encJSONData);

  const cid = await storeData(encJSONData);
  console.log("Stored on Cloud with CiD: ", cid);

  return cid;

};

const decryptData = async (secretShares, encJSONData) => {
  
  const origKey = secrets.combine(secretShares);
  // console.log(origKey);
  // console.log(encJSONData);
  // Checking Decrypting data here
  const decDataBytes = await AES.decrypt(encJSONData, origKey);

  const decData = JSON.parse(decDataBytes.toString(UTF8));
  console.log(decData);

  return decData;
};

export const fetchAndDecrypt = async (secretShares, cid) => {
  const fetchedData = await fetchCid(cid);
  // Fetched Data Stored in Cloud in Encrypted

  // Steps needed to do here are
  // 1. Decrypt the Encrypted Data
  // 2. Convert back to original Form
  // 3. Read data from the Object
  console.log("Fetched Data: ", fetchedData);

  const plainText = await fetchedData[0].text();
  // console.log("Plain Text: ", plainText);
  console.log("JSON: ", JSON.parse(plainText));
  const decryptedJSON = await decryptData(
    secretShares,
    JSON.parse(plainText)["data"]
  );
  return decryptedJSON;
};

// Gives back a randomkey 512 bytes
export const createRandomKey = () => {
  return secrets.random(512);
};

export const createShards = (secret, total, threshold) => {
  // Creating Shamir Secrets with Total Shares and Threshold
  if (secret != null) {
    return secrets.share(secret, total, threshold);
  } else {
    const randomSecret = createRandomKey();
    console.log(
      "Failed to get secret:-> Creating a Random Secret: ",
      randomSecret
    );
    return secrets.share(randomSecret, total, threshold);
  }
};

export const combineShards = (shares) => {
  if (typeof shares !== "object") {
    throw new Error("Array Object Required to combined shares");
  }
  // console.log(shares);
  // Shares is an array of shared secrets
  return secrets.combine(shares);
};
