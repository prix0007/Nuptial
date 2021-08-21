import React from 'react';

import {
    createZip,
    createRandomKey,
    createShards
} from '../zip';

import {
    setCid,
    setSecret,
    setShards
} from '../actions';

import {
    useDispatch, useStore
} from 'react-redux';
import Secrets from './Secrets';

const Upload = () => {

    const dispatch = useDispatch();
    const store = useStore();

    const [uploadState, setUploadState] = React.useState({
        files: null,
        secret: "",
        loading: false
    })

    const setLoading = (curState) => {
        setUploadState({
            ...uploadState,
            loading: curState
        })
    }

    const updateFromGlobalState = () => {
        const currentState = store.getState();
        setUploadState({
            ...uploadState,
            secret: currentState["global"]["secret"]
        })
    }

    React.useEffect(() => {
        
    }, [uploadState.files])

    const onChangeFile = async (e) => {
        const files = e.target.files;
        // const filesKeyArr = Object.keys(files);
        console.log(files);
        var i;
        for (i = 0; i < files["length"]; ++i) {
          console.log(files[i]);
        }

        setUploadState({
            ...uploadState,
            files
        });
    };

    const onUpload = async () => {
        updateFromGlobalState();
        const {files, secret} = uploadState;
        console.log("From Secret", secret)
        console.log("Files", files)
        if(files !== null && secret !== null && secret.trim().length > 10){
            setLoading(true);
            const cid = await createZip(files, secret);
            console.log(cid);
            dispatch(setCid(cid));
            setLoading(false);
        }
      
    }

    return (
        <div>
            <input
                multiple
                type="file"
                name="file"
                onChange={(e) => onChangeFile(e)}
            />
            {
                uploadState.loading 
                ? <progress class="progress is-small is-primary" max="100">15%</progress>
                : <button className="button is-primary" onClick={() => {onUpload()}}>Upload Files</button>
            }
      </div>
    )
}

export default Upload
