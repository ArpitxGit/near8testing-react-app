import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ConnectMetamask from "../../components/Landing/ConnectMetamask";
import styles from "./Register.module.css";
import { loginMetaMask } from "../../actions/metamask";
import Web3 from "web3";
import { connect } from "react-redux";
import { fetchData } from "../../utils";
import { checkIsEmail, checkIsLength } from "../../utils";

const Register = ({ toast, isMetaMaskConnected, metaMaskAddress }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
    if (!checkIsLength(name, 1)) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      let res = await fetchData("POST", `/user/signup`, {
        name,
        email,
        password,
      });
      if (res.success) {
        navigate("/create");
        sessionStorage.setItem("Auth Token", res.token);
        console.log("Signedup and Logged in");
      } else {
      }
    } catch (err) {
      toast.error("Internal Server Error");
    }
  };

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
    <div className={styles.body}>
      <div className={styles.registerBox}>
        <form className={styles.registerForm}>
          <div className={styles.formH1}>Register your account</div>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <div className={styles.registerBtn} onClick={handleOnSubmit}>
            Register now
          </div>
          <div
            className={styles.loginLink}
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have a account?
          </div>
          <h8 className={styles.header}>or</h8>
          <div className={styles.registerLink1} onClick={connectToMetaMask}>
            Connect To Metamask
          </div>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  toast: PropTypes.func,
  isMetaMaskConnected: PropTypes.bool,
  loginMetaMask: PropTypes.func,
};
const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
  metaMaskBalance: state.metamask.metaMaskBalance,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
