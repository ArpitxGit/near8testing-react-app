import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import Web3 from "web3";
import { Link } from "react-router-dom";
import styles from "./connect.module.css";
import { loginMetaMask } from "../../actions/metamask";
import { useNavigate } from "react-router";

import { ConnectButton } from "0xpass";

const ConnectMetaMask = ({
  inline,
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
        <div className={!inline ? styles.cnct : styles.cnctInline}>
          {/* <Link to="/login"> */}
          {/* <Button className={styles.bt}>Login/Signup</Button> */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              console.log({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              });
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className={styles.bt}
                          type="button"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button">
                          Wrong network
                        </button>
                      );
                    }

                    if (connected) {
                      const { address } = account;
                      sessionStorage.setItem("walletid", address);
                      navigate("/create");
                    }

                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          onClick={openChainModal}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "28px",
                          }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          style={{ fontSize: "28px" }}
                          type="button"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          {/* </Link> */}
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
