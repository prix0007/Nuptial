import "./App.css";
import React from "react";

import { initWallet } from "./solana/wallet";
import certificateService from "./solana/certificate";
import { getChatMessageAccountPubkey } from "./solana/accounts";

import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import Certificate from "./components/Certificate";
import Home from "./components/Home";
import AccountCertificate from "./components/AccountCertificate";
import About from "./components/About";

import { addNotification, setCertificate } from "./actions";

function App() {
  const dispatch = useDispatch();
  const conn = React.useRef();
  const [myWallet, setMyWallet] = React.useState(null);
  const [myCertificateAddress, setMyCertificateAddress] = React.useState("");

  const connectWallet = () => {
    initWallet().then(([connection, wallet]) => {
      // console.log(connection, wallet)
      conn.current = connection;
      setMyWallet(wallet);
      // console.log(wallet.publicKey);
      if (wallet.publicKey) {
        getChatMessageAccountPubkey(
          connection,
          wallet,
          certificateService.CERTIFICATE_SIZE
        ).then((walletCertificatePubkey) => {
          setMyCertificateAddress(walletCertificatePubkey.toBase58());
          getCertificateInternal(
            connection,
            walletCertificatePubkey.toBase58()
          );
        });
      }
    });
  };

  const getCertificate = () => {
    console.log(conn);
    if (conn.current) {
      getCertificateInternal(conn.current, myCertificateAddress);
    }
  };

  // const sendDummyCertificate = async () => {

  //   let cid = "bafybeigjot52ohlxifpzaur5gfpcg4utccvhspygpz2pnpr7yrorrmopca";
  //   let shard = "801308886c9b5e7472b210e01731dde36e103056dfe903f5bf3a2138ac6f393c0a4e6281966f156e04db3994d9003377766bbd423081d1c452d3976badb16362b260e1de62af78761a8dbe2a889f67279c0";
  //   let bride = "Jane McKenzie";
  //   let groom = "John Walker";

  //   const res = await certificateService.sendCertificate(
  //     conn.current,
  //     myWallet,
  //     myCertificateAddress,
  //     cid,
  //     bride,
  //     groom,
  //     shard,
  //   );

  //   console.log(res);

  // }

  const getCertificateInternal = (connection, walletCertificatePubketStr) => {
    certificateService
      .getAccountMessageHistory(connection, walletCertificatePubketStr)
      .then((res) => {
        dispatch(setCertificate(res));
        dispatch(
          addNotification({
            text: "Successfully Fetched Data from Blockchain",
            type: "success",
          })
        );
      })
      .catch((err) => {
        console.log("Error", err);
        dispatch(
          addNotification({
            text: "Looks like you don't have any certificate yet. Try Registering one from Register Tab.",
            type: "danger",
          })
        );
      });
  };

  return (
    <Router>
      <Navbar connectWallet={connectWallet} wallet={myWallet} />
      <Switch>
        <Route path={`/certificate/:cid`}>
          <Certificate />
        </Route>
        <Route path="/registration">
          <RegistrationForm
            connection={conn}
            wallet={myWallet}
            certificateAddr={myCertificateAddress}
          />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          {myCertificateAddress ? (
            <AccountCertificate
              certificateAddr={myCertificateAddress}
              getCertificate={getCertificate}
            />
          ) : (
            <Home />
          )}
        </Route>
      </Switch>
      <Notification />
    </Router>
  );
}

export default App;
