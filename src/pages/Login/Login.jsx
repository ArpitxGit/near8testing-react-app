import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ConnectMetamask from "../../components/Landing/ConnectMetamask";
import styles from "./Login.module.css";
import { fetchData } from "../../utils";
import { checkIsEmail, checkIsLength } from "../../utils";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import { loginMetaMask } from "../../actions/metamask";
import Web3 from "web3";
import CupertinoPaneContainer from "../../components/Landing/CupertinoPaneContainer";
import CupertinoPaneContent from "../../components/Landing/CupertinoPaneContent";
import classNames from "classnames";

const Login = ({
  loginMetaMask,
  toast,
  isMetaMaskConnected,
  metaMaskAddress,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!checkIsEmail(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!checkIsLength(password, 6)) {
      toast.error("Password length less than 6");
      return;
    }
    try {
      let res = await fetchData("POST", `/user/login`, {
        email,
        password,
      });
      if (res.success) {
        navigate("/create");
        console.log("Loggedin");
        sessionStorage.setItem("Auth Token", res.token);
      } else {
      }
    } catch (err) {
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("Auth Token")) {
      navigate("/create");
    }
  }, []);
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
    <div className={classNames(styles.body, "loginPage")}>
      <div className={styles.loginBox}>
        <div className={styles.loginForm}>
          <div className={styles.formH1}>Login to your account</div>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.loginBtn} onClick={handleOnSubmit}>
            Login now
          </div>
          <div
            className={styles.registerLink}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Create a new account?
          </div>
          <div className={styles.header}>or</div>
          <div className={styles.registerLink1} onClick={connectToMetaMask}>
            Connect To Metamask
          </div>
        </div>
      </div>
      <CupertinoPaneContainer
        refreshToken={"token"}
        parentClass="loginPage"
        className="loginForm"
      >
        <CupertinoPaneContent />
      </CupertinoPaneContainer>
    </div>
  );
};

Login.propTypes = {
  toast: PropTypes.func,
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
