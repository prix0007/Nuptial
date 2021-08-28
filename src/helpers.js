import { v4 as uuidv4 } from "uuid";

import { createShards, createRandomKey } from "./zip";

import AES from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";

import { storeData } from "./db";

export const getType = (ext) => {
  let extType = "";
  switch (ext) {
    case "jpg":
    case "JPG":
    case "png":
    case "PNG":
      extType = "image";
      break;
    case "txt":
    case "TXT":
      extType = "text";
      break;
    case "json":
    case "JSON":
      extType = "json";
      break;
    default:
      extType = "raw";
      break;
  }
  return extType;
};

export function decodeBase64(data) {
  if (typeof Buffer === "function") {
    return Buffer.from(data, "base64").toString("utf-8");
  } else {
    throw new Error("Failed to determine the platform specific decoder");
  }
}

const fileTobase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

// Convert Files to base64 and make them private
// Convert Data based on private or public and parse as needed
// Upload to Cloud IPFS Storage and get CID

export const processJSONfromFORM = async (formObj) => {
  const finalJSON = {
    public: {
      groom: {},
      bride: {},
      witnesses: [],
      year_of_marriage: "",
      place: "",
    },
    private: {
      groom: {},
      bride: {},
      witnesses: [],
      files: {},
    },
  };

  try {
    // Destructure Data here
    const { files, bride, groom, witnesses, year_of_marriage, place } = formObj;

    // Process Files First
    if (files) {
      var i;
      for (i = 0; i < files["length"]; ++i) {
        console.log(files[i].name);
        finalJSON["private"]["files"][files[i].name] = await fileTobase64(
          files[i]
        );
      }
    }

    if (bride) {
      finalJSON["public"]["bride"]["name"] = bride.public.name;
      finalJSON["public"]["bride"]["age"] = bride.public.age;
      finalJSON["public"]["bride"]["gender"] = bride.public.gender;
      finalJSON["private"]["bride"]["identification_no"] =
        bride.private.identification_no;
    }

    if (groom) {
      finalJSON["public"]["groom"]["name"] = groom.public.name;
      finalJSON["public"]["groom"]["age"] = groom.public.age;
      finalJSON["public"]["groom"]["gender"] = groom.public.gender;
      finalJSON["private"]["groom"]["identification_no"] =
        groom.private.identification_no;
    }
    if (witnesses.length > 0) {
      const localUIDState = {};
      finalJSON["public"]["witnesses"] = witnesses.map((witness, index) => {
        const newUUiD = uuidv4();
        localUIDState[index] = newUUiD;
        return {
          name: witness.public.name,
          age: witness.public.age,
          gender: witness.public.gender,
          uuid: newUUiD,
        };
      });
      finalJSON["private"]["witnesses"] = witnesses.map((witness, index) => {
        return {
          identification_no: witness.private.identification_no,
          uuid: localUIDState[index],
        };
      });
    }

    if (place) {
      finalJSON["public"]["place"] = place;
    }

    if (year_of_marriage) {
      finalJSON["public"]["year_of_marriage"] = year_of_marriage;
    }

    console.log("Creating Secret...");
    console.log("1. Creating a 512Byte long secret");
    const secretKey = createRandomKey();
    console.log(secretKey);
    console.log(
      "2. Splitting Secret into 3 Shares. Total Keys : 3 , Minimum Threshold to recover key : 2"
    );
    const shares = createShards(secretKey, 3, 2);
    console.log(shares);
    console.log("3. Embedding 1 Secret Key in Data Itself");
    finalJSON["secret"] = shares[0];

    console.log("Encrypting Private Data with secretKey...");
    const unencData = finalJSON["private"];
    const encData = await AES.encrypt(
      JSON.stringify(unencData),
      secretKey
    ).toString();

    console.log(
      "Reassigning the encrypted data to private Section of finalJSON"
    );
    finalJSON["private"] = encData;

    // console.log(finalJSON);

    console.log("Uploading File to Cloud ... ");
    const cid = await storeData(finalJSON, shares[0] + ".txt");

    console.log("Stored in IPFS with cid:", cid);

    return {
      status: true,
      cid,
      shards: shares,
    };
  } catch (e) {
    return {
      status: false,
      cid: null,
      shards: null,
    };
  }
};

export const decryptPrivateData = async (privateData, secret) => {
  const decDataBytes = await AES.decrypt(privateData, secret);

  const decData = JSON.parse(decDataBytes.toString(UTF8));
  console.log(decData);

  return decData;
}
