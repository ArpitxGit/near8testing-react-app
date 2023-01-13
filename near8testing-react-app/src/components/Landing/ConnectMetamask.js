import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import Web3 from "web3";
import { Link } from "react-router-dom";
import styles from "./connect.module.css";
import { loginMetaMask } from "../../actions/metmask";
import { useNavigate } from "react-router";

const ConnectMetaMask = ({
  loginMetaMask,
  isMetaMaskConnected,
  metaMaskAddress,
  metaMaskBalance,
}) => {
  const navigate = useNavigate();
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      return window.alert("Please install MetaMask!");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("Accounts are ", accounts);
    loginMetaMask(accounts[0]);
  };
  const connectToMetaMask = async () => {
    await loadWeb3();
  };
  useEffect(() => {
    if (isMetaMaskConnected) {
      sessionStorage.setItem("walletid", metaMaskAddress);
      navigate("/create");
    }
  }, [isMetaMaskConnected, navigate, metaMaskAddress]);
  return (
    <>
      <>
        <div className={styles.cnct}>
          <Link to="/login">
            <Button className={styles.bt}>Login/Signup</Button>
          </Link>
          {/* <Button className={styles.bt} variant="contained" onClick={connectToMetaMask}>Connect To Metamask</Button> */}
        </div>
      </>
    </>
  );
};
ConnectMetaMask.propTypes = {
  isMetaMaskConnected: PropTypes.bool,
  loginMetaMask: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
  metaMaskBalance: state.metamask.metaMaskBalance,
});

const mapDispatchToProps = {
  loginMetaMask,
};
export default connect(mapStateToProps, mapDispatchToProps)(ConnectMetaMask);
