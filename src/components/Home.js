import React from "react";

import { listUploads } from "../db";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const Home = () => {
  const [curCerts, setCerts] = React.useState([]);

  const fetchFiles = async () => {
    setCerts([...(await listUploads())]);
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <div class="columns">
        {curCerts.map((certMeta) => {
          return (
            <div class="column is-one-quarter" key={certMeta.cid}>
              <Link
                to={`/certificate/${certMeta.cid}`}
              >
                <div class="card">
                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img
                        src="https://image.flaticon.com/icons/png/512/187/187868.png"
                        alt="Placeholder Mix"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img
                            src="https://image.flaticon.com/icons/png/512/3381/3381663.png"
                            alt="Placeholder Mix"
                          />
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-6">{certMeta.cid}</p>
                        <p class="subtitle is-6">
                          Created @{dayjs(certMeta.created).fromNow()}
                        </p>
                      </div>
                    </div>

                    <div class="content">
                      File Size: <strong> {certMeta.dagSize} bytes </strong>
                    </div>
                    <div class="content">
                      Total Pins: <strong> {certMeta.pins.length} </strong>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
