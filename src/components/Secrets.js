import React from 'react'

import {
    createRandomKey,
    createShards
} from '../zip';

import {
    setSecret,
    setShards,
    removeSecret,
    removeShards
} from '../actions';

import { useDispatch, useStore } from 'react-redux';

const Secrets = () => {
 
    const dispatch = useDispatch();
    const store = useStore();

    const [secretState, setSecretState] = React.useState({
        threshold: 2,
        total: 3,
        secret: "",
        shards: []
    })

    const updateFromGlobalState = () => {
        const currentState = store.getState();
        setSecretState({
            ...secretState,
            secret: currentState["global"]["secret"],
            shards: currentState["global"]["shards"]
        })
    }

    React.useEffect(() => {
        updateFromGlobalState()
    }, [])

    const create = () => {
        const secret = createRandomKey();
        dispatch(setSecret(secret));
        updateFromGlobalState();
    }   

    const createShardsComponent = () => {
        const {
            threshold,
            total,
            secret
        } = secretState;

        if(total < threshold || secret === null || secret.trim() === ""){
            alert("No Secret Created!!!");
            return;
        }

        const shards = createShards(secret, total, threshold);

        dispatch(setShards(shards));

        updateFromGlobalState()

    }

    const removeSecrets = () => {
        dispatch(removeSecret());
        dispatch(removeShards());
        updateFromGlobalState();
    }

    return (
        <div>
            <h2 className="is-size-3">Current Secret and Shards</h2>
            <div className="columns">
                <div className="column is-half">
                    <p className="text is-primary is-title is-4 has-text-weight-medium">Current Secret: {secretState["secret"]}</p>
                    <br />
                    <button className="button is-primary" onClick={() => create()}>Create Secret</button>
                </div>
                <div className="column is-half">
                    <p className="text">Current Shards </p>
                    {secretState["shards"] && secretState["shards"].map(shard => {
                        return [<p key={shard} className="text has-text-weight-medium has-text-info">{shard}</p>, <hr className="has-text-white	hr"/>]
                    })}
                    <br />
                    <button className="button is-primary" onClick={() => createShardsComponent()}>Create Shards</button>
                </div>
            </div>
            <button className="button is-danger "  onClick={() => removeSecrets()}>Reset Secret & Shards</button>
        </div>

    )
}

export default Secrets