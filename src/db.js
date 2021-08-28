import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

const getAccessToken = () => {
    return process.env.REACT_APP_STORAGE_API;
}

const makeStorageClient = () => {
    return new Web3Storage({token: getAccessToken()})
}

export const listUploads = async () => {
    const client = makeStorageClient();
    const fileList = [];
    for await (const upload of client.list()) {
        fileList.push(upload);
        // console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
      }
     return fileList;
}

export const storeData = async (jsonData, fileName = "data.txt") => {
    const client = makeStorageClient();
   
    const blob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    const file = new File([blob], fileName)
    const cid = await client.put([file]);
    console.log("Stored files with cid: ", cid);
    return cid;
}

export const fetchCid = async (cid) => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    console.log(res);
    if (!res.ok) {
      throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }
    
    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
        console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
    }
    return files;
}