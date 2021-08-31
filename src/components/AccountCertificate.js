import React from "react";

import { useSelector } from "react-redux";

import { Link } from 'react-router-dom';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AccountCertificate = ({ certificateAddr, getCertificate }) => {
  const ownCertificate = useSelector((state) => state.ownCertificate);

  const { cid, bride, groom, shard, created_on } = ownCertificate;

  return (
    <div className="container">
      <div className="card mt-6">
        <div className="card-content">
          <div className="media">
            <figure className="image is-64x64">
              <img
                src="https://image.flaticon.com/icons/png/512/1017/1017466.png"
                alt="wallet connecetd"
              />
            </figure>
            <div className="media-content ml-2">
              <p className="title is-4">Wallet Connected to Certificate Account</p>
              <a className="subtitle is-6 is-bold has-text-info" href={`https://explorer.solana.com/address/${certificateAddr}?cluster=devnet`} target="_blank" rel="noreferrer">@{certificateAddr}</a>
            </div>
          </div>
          <div className="content">
            {cid !== "" ? (
              <div>
                <p>
                  This certificate is stored on solana blockchain as a proof of
                  marriage between <strong>{bride.replaceAll("X", "")}</strong> and{" "}
                  <strong>{groom.replaceAll("X", "")}</strong> which was created at <strong>{dayjs(parseInt(created_on)).fromNow()}</strong>
                </p>
                <div  className="border p-1">
                    <p className="is-size-5	">Certificate Particular</p>
                    <div className="p-2">
                        <p>Content ID on IPFS: </p>
                        <Link to={`/certificate/${cid}`}><strong className="breakWord">{cid}</strong></Link> 
                        <p className="is-italic">Click on above link to view all data and use your shard too.</p>   
                    </div>
                    <div className="p-2">
                        <p>Secret Shard Fragment: </p>
                        <p><strong className="breakWord">{shard}</strong></p>    
                    </div>
                </div>
              </div>
            ) : (
              <button className="button is-primary" onClick={() => getCertificate()}>Try Getting Data</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCertificate;
