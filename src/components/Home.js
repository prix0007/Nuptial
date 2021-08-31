import React from "react";

import { listUploads } from "../db";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Link } from "react-router-dom";

import { programId } from "../solana/program";

dayjs.extend(relativeTime);

const Home = () => {
  const [curCerts, setCerts] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    const certificates = await listUploads();
    setCerts([...certificates]);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container p-2">
      <div className=" mt-5 mb-3">
        <p className="is-title is-size-3"> All Marriage Certificates</p>
        <div className="is-subtitle is-size-5	" style={{wordBreak: "break-all"}}>
          Solana Executor Contract:
          <a
            href={`https://explorer.solana.com/address/${programId.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            {programId.toBase58()}
          </a>
        </div>
        <span className="tag">
          Connect to your wallet to view if you have any certificates
        </span>
      </div>
      <div className="columns is-flex is-flex-wrap-wrap	">
        {curCerts.length > 0 ? (
          curCerts.map((certMeta) => {
            return (
              <div className="column is-one-quarter" key={certMeta.cid}>
                <Link to={`/certificate/${certMeta.cid}`}>
                  <div className="card">
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img
                          src="https://image.flaticon.com/icons/png/512/187/187868.png"
                          alt="Placeholder Mix"
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <div className="media">
                        <div className="media-left">
                          <figure className="image is-48x48">
                            <img
                              src="https://image.flaticon.com/icons/png/512/3381/3381663.png"
                              alt="Placeholder Mix"
                            />
                          </figure>
                        </div>
                        <div className="media-content">
                          <p className="title is-6">{certMeta.cid}</p>
                          <p className="subtitle is-6">
                            Created @{dayjs(certMeta.created).fromNow()}
                          </p>
                        </div>
                      </div>

                      <div className="content">
                        File Size: <strong> {certMeta.dagSize} bytes </strong>
                      </div>
                      <div className="content">
                        Total Pins: <strong> {certMeta.pins.length} </strong>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="column">
            {loading ? (
              <progress className="progress is-medium is-primary" max="100">
                15%
              </progress>
            ) : (
              <h2 className="is-size-3">
                Looks like no Certificate Found 😓😓.
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
