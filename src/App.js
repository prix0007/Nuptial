import logo from "./logo.svg";
import "./App.css";
import React from "react";

import { createZip, fetchAndDecrypt } from "./zip";

import { useStore } from "react-redux";

import Upload from './components/Upload';
import SecretsComponent from './components/Secrets';

import { getType, decodeBase64 } from './helpers';

function App() {
  
  const store = useStore();
  const [state, setState] = React.useState({
    cid: "",
    decryptedFiles: null,
    global: null,
    loading: false
  });

  const updateLocalGlobalState = () => {
    const currentState = store.getState();
    setState({
      ...state,
      global: {
        ...currentState["global"]
      }
    })
  }

  const setLoading = (newLoading) => {
    setState({
      ...state,
      loading: newLoading
    })
  }

  React.useEffect(() => {
    updateLocalGlobalState()
  }, [state.cid])

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleGet = async () => {
    
    const { cid, global: {shards} } = state;
    
    console.log(shards);
    setLoading(true);

    const decryptedJSON = await fetchAndDecrypt(shards.slice(0,2), cid);
    
    setState({
      ...state,
      loading: false,
      decryptedFilesJSON: decryptedJSON
    })
  };

  
  const createJSONObjectView = () => {
    const {decryptedFilesJSON} = state; 
    const finalViewObj = [];
    if(decryptedFilesJSON) {
      Object.keys(decryptedFilesJSON).forEach((key) => {
        finalViewObj.push(<p>Filename: {key}</p>);
        switch(getType(key.split('.').pop())) {
          case "image": finalViewObj.push(<img src={decryptedFilesJSON[key]} alt={key} className="image"/>); break;
          case "text": finalViewObj.push(<p>{decodeBase64(decryptedFilesJSON[key].split(',').pop())}</p>); break;
          default:
        }
      })
    }
    return finalViewObj;
  }

  return (
    <div className="container">
      <br />
      <SecretsComponent />
      <br />
      <Upload />
      <br />
      <div>
        <input
          type="text"
          name="cid"
          placeholder="Input cid to fetch"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <button onClick={() => handleGet()}>Fetch</button>
      </div>
      <br />
      
      <div>
        {
          state.loading ? <p>Loading ...</p> : <p>Loaded</p>
        }
      </div>
      <div>
        {
          createJSONObjectView()
        }
      </div>
    </div>
  );
}

export default App;
