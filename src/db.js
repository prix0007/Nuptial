import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";


const getAccessToken = () => {
  return process.env.REACT_APP_STORAGE_API;
};

const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() });
};

const client = makeStorageClient();

export const listUploads = async () => {
  // const client = makeStorageClient();
  const fileList = [];
  for await (const upload of client.list()) {
    fileList.push(upload);
    // console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
  }
  return fileList;
};

export const storeData = async (jsonData, fileName = "data.txt") => {
  // const client = makeStorageClient();

  const blob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  const file = new File([blob], fileName);
  const cid = await client.put([file]);
  console.log("Stored files with cid: ", cid);
  return cid;
};

async function toWeb3File ({ content, path, cid }) {
    const chunks = []
    for await (const chunk of content()) {
      
      chunks.push(chunk)
    }
    const file = new File(chunks,toFilenameWithPath(path))
    return Object.assign(file, { cid: cid.toString() })
  }
  
function toFilenameWithPath (unixFsPath) {
  const slashIndex = unixFsPath.indexOf('/')
  return slashIndex === -1 ? unixFsPath : unixFsPath.substring(slashIndex + 1)
}

export const fetchCid = async (cid) => {
  // const client = makeStorageClient();
  const res = await client.get(cid);
  // console.log(`Got a response! [${res.status}] ${res.statusText}`);
  // console.log(res);
  if (!res.ok) {
    throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`);
  }


  const files = []
  for await (const entry of res.unixFsIterator()) {
    // console.log(`got unixfs of type ${entry.type}. cid: ${entry.cid} path: ${entry.path}`);
    
    // entry.content() returns another async iterator for the chunked file contents
    if (entry.type === 'directory') {
      continue
    }
    
    const file = await toWeb3File(entry)
    files.push(file)
    
  }
 
  return files;
  
};
