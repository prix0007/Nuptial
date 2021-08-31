import React from "react";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isIPFS from "is-ipfs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// import { fetchCid } from "../db";
import { combineShards } from "../zip";
import { addNotification, setShards } from "../actions";
import { decryptPrivateData, getType, decodeBase64 } from "../helpers";

dayjs.extend(relativeTime);

const Certificate = () => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const [certificate, setCertificate] = React.useState(null);

  const [inputShard, setInputShard] = React.useState("");

  const [isDecrpted, setDecrypted] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  
  const globalShards = useSelector((state) => state.global.shards);

  const getCidData = async (cid, fileName) => {
    if(!cid || !fileName){
      dispatch(addNotification({
        text: "Not Correct URL Format..",
        type: "danger"
      }))
    }
    const dataUrl = "https://gateway.ipfs.io/ipfs/" + cid + "/" + fileName + ".txt"
    console.log(dataUrl);
    const res = await fetch(dataUrl);
    return res.text()
  }

  const fetchData = async (cid) => {
    // console.log("Fetch Data Triggered");
    // const fetchedData = await fetchCid(cid);
    // Having error with asyncIterable in Production so using public ipfs nodes to getData
    // Don't pose an issue as data is encrypted
  
    // console.log(fetchedData);
    // const plainText = await fetchedData[0].text();
    // console.log("Plain Text: ", plainText);

    const plainText = await getCidData(cid, "data");
    
    // console.log("JSON: ", JSON.parse(plainText));
    const JSONCertificate = JSON.parse(plainText);
    setCertificate({...JSONCertificate});
    setLoading(false);
    dispatch(setShards([JSONCertificate["secret"]]));
  };

  const makePublicData = () => {
    const views = [];

    const { public: publicData, secret } = certificate;

    const { groom, bride, witnesses, year_of_marriage, place } = publicData;

    views.push(
      <div className="card column is-half mb-5" key="main">
        <div className="card-image">
          <img
            className="cert-image"
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8"
            alt="Placeholder marriage"
          />
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img
                  src="https://image.flaticon.com/icons/png/512/3656/3656836.png"
                  alt="Placeholder Icon"
                />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">
                {groom["name"]} and {bride["name"]}
              </p>
            </div>
          </div>

          <div className="content">
            <p>
              were bind is the bond of marriage and we are glad to view this as
              their everlasting bond in life and always present on blockchain.
            </p>
            {witnesses.length > 0 && (
              <p>
                Their marriage is witnessed by{" "}
                {witnesses.map((witness) => (
                  <span key={witness.name}>{witness.name}</span>
                ))}
              </p>
            )}
            <br />
            <p>Place: {place}</p>
            <time>Were married: {dayjs(year_of_marriage).fromNow()}</time>
            <br />
            <p className="mt-4">
              Secret Fragment for this certificate:{" "}
              <strong style={{ wordBreak: "break-word" }}>{secret}</strong>
            </p>
          </div>
        </div>
      </div>
    );

    return views;
  };

  const renderView = () => {
    if (isIPFS.cid(cid)) {
      if (certificate === null ) {
        if(loading === false){
          setLoading(true);
          fetchData(cid);
        }
        return <p className="title">Loading../..\ Certificate</p>;
      } else {
        return <div className="columns">{makePublicData()}{renderPrivateData()}</div>;
      }
    } else {
      return (
        <div className="mt-4">
          <h1 className="title">
            UGH.. Looks like which you are trying to fetch is not a valid cid{" "}
          </h1>
        </div>
      );
    }
  };

  const tryDecryptingData = async () => {
    // dispatch(setShards([...globalShards, inputShard]));
    console.log("Trying to recreate secret Key...", globalShards, inputShard);

    const genSecret = combineShards([...globalShards, inputShard]);
    console.log("Generated Secret from Shards is :", genSecret);

    dispatch(
      addNotification({
        text: `Created New Secret: ${genSecret}`,
        type: "info",
      })
    );

    console.log("Trying to decrypt from Generated Secret.");
    const privateData = certificate["private"];
    // console.log("Private Data: ", privateData);

    try {
      const decryptedData = await decryptPrivateData(privateData, genSecret);
      dispatch(
        addNotification({
          text: `Successfully Decrypted your data Congrats on your Marriage Certificate. 😊👏🎉🎉`,
          type: "success",
        })
      );
      setDecrypted(true);
      setCertificate({
        ...certificate,
        private: decryptedData,
      });
    } catch (e) {
      console.log(e);
      dispatch(
        addNotification({
          text: `Oops, Looks like wrong secret is tried. Make sure you have correct secret 😉😉`,
          type: "danger",
        })
      );
    }
  };

  const renderInputView = () => {
    return !isDecrpted && (
      <div className="is-flex mb-3">
        <textarea
          className="textarea is-primary"
          type="text"
          placeholder="Enter security shard to view private data."
          value={inputShard}
          onChange={(e) => {
            setInputShard(e.target.value);
          }}
        />
        <button
          className=" ml-3 button is-primary"
          onClick={() => tryDecryptingData()}
        >
          View Private Data
        </button>
      </div>
    );
  };

  

  const renderPrivateData = () => {
    if(!certificate) return;
    const { private: priv } = certificate;
    return (
      isDecrpted &&
      typeof priv !== "string" && (
        <div className="is-flex is-flex-direction-column column is-half">
          <p className="is-size-5 has-text-primary">Private Data in this Certificate</p>
          <div className="card">
            <div className="card-content">
              <div className="content">
                <h4>
                  Bride Identification Number:{" "}
                  {priv["bride"]["identification_no"]}
                </h4>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="content">
                <h4>
                  Groom Identification Number:{" "}
                  {priv["groom"]["identification_no"]}
                </h4>
              </div>
            </div>
          </div>
          {priv["witnesses"].map((witness, index) => {
            return (
              <div className="card" key={`witness-priv-${index}`}>
                <div className="card-content">
                  <div className="content">
                    <h4>
                      Witness {index + 1} Identification No. :{" "}
                      {witness["identification_no"]}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
          {Object.keys(priv["files"]).map((key, index) => {
            switch (getType(key.split(".").pop())) {
              case "image":
                return  <div className="card" key={`file-priv-${index}`}>
                  <div className="card-content">
                    <div className="media">
                        <img src={priv["files"][key]} alt={key} className="image" /> 
                      </div>
                    </div>
                   </div>
              case "text":
                  return <div className="card" key={`file-priv-${index}`}>
                  <div className="card-content">
                    <div className="media">
                      <p>{decodeBase64(priv["files"][key].split(",").pop())}</p>
                      </div>
                    </div>
                   </div>
              default: return <p></p>;
            }
          })}
        </div>
      )
    );
  };

  return (
    <div className="container is-flex is-flex-direction-column  is-justify-content-center is-align-items-center	pt-6">
      {renderInputView()}
      {renderView()}
    </div>
  );
};

export default Certificate;
