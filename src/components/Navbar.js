import React from "react";

import { Link } from "react-router-dom";

const Navbar = ({ connectWallet, wallet }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <nav
      className="navbar is-fixed-top "
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <img
          src="https://image.flaticon.com/icons/png/512/3656/3656836.png"
          width="70"
          height="70"
          alt="test"
          className="navbar-item"
        />
        <div className="navbar-item">
          <p className="is-size-5 has-text-primary">Nuptial</p>
        </div>

        <div
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => setOpen(!isOpen)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${isOpen && "is-visible "}`}
      >
        <div className="navbar-start">
          <a className="navbar-item" href="/">
            Home
          </a>

          <a className="navbar-item" href="/registration">
            Registration
          </a>

          <div className="navbar-item has-dropdown is-hoverable">
            <p className="navbar-link">More</p>

            <div className="navbar-dropdown">
              <Link className="navbar-item" to="/about">
                About
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          {wallet !== null ? (
            <div className="navbar-item breakWord">
              <strong>{wallet.publicKey.toBase58()}</strong>
            </div>
          ) : (
            <div className="navbar-item">
              <div className="buttons">
                <button
                  className="button is-primary"
                  onClick={() => connectWallet()}
                >
                  <strong>Connect Wallet</strong>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
