
import "./App.css";
import React from "react";

import { initWallet, WalletAdapter } from "./solana/wallet";
import messageService from "./solana/messages";
import { Connection } from "@solana/web3.js";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import Certificate from "./components/Certificate";
import Home from "./components/Home";

function App() {
  // Test Area
  const conn = React.useRef();
  const [myWallet, setMyWallet] = React.useState();
  React.useEffect(() => {
    // initWallet().then(([connection, wallet]) => {
    //   console.log(connection, wallet)
    //   conn.current = connection;
    //   setMyWallet(wallet);
    //   console.log(wallet.publicKey)
    // })
  }, []);

  const connectWallet = () => {
    initWallet().then(([connection, wallet]) => {
      console.log(connection, wallet)
      conn.current = connection;
      setMyWallet(wallet);
      console.log(wallet.publicKey)
    })
  }

  return (
      <Router>
        <Navbar connectWallet={connectWallet} />
        <Switch>
          <Route path={`/certificate/:cid`}>
            <Certificate />
          </Route>
          <Route path="/registration">
            <RegistrationForm />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Notification />
      </Router>
  );
}

export default App;
