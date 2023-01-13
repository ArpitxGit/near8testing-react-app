import * as React from "react";
import ConnectMetamask from "./ConnectMetamask";
import { connect } from "react-redux";
import styles from "./content.module.css";
import logo from "../../assets/logo.gif";
import Iframe from "react-iframe";

function Content({ isMetaMaskConnected, metaMaskAddress, table }) {
  return (
    <>
      <div style={{ "--aspect-ratio": 16 / 9 }}>
        <Iframe
          url="https://reverent-shirley-1ea17b.netlify.app/1/"
          width="1600"
          height="900"
          frameborder="0"
        />
      </div>
      <div className={styles.bod}>
        <div className={styles.hdr}>
          <ConnectMetamask
            isMetaMaskConnected={isMetaMaskConnected}
            metaMaskAddress={metaMaskAddress}
          ></ConnectMetamask>
          <img className={styles.im} src={logo} alt="my-gif" />
        </div>
        <div className={styles.content}>
          <h1>Mint Your Moments</h1>
          <h4>Buy/Sell Real Life Moments</h4>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Content);
