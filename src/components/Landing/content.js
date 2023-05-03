import React from "react";
import ConnectMetamask from "./ConnectMetamask";
import { connect } from "react-redux";
import styles from "./content.module.css";
import logo from "../../assets/logo.gif";
import Iframe from "react-iframe";
import CupertinoPaneContainer from "../../components/Landing/CupertinoPaneContainer";
import CupertinoPaneContent from "../../components/Landing/CupertinoPaneContent";
import useKrpano from "react-krpano-hooks";

function Content({ isMetaMaskConnected, metaMaskAddress, table }) {
  const { containerRef } = useKrpano();
  return (
    <>
      {/* <div style={{ "--aspect-ratio": 16 / 9 }}>
        <Iframe
          url="https://reverent-shirley-1ea17b.netlify.app/1/"
          width="1600"
          height="900"
          frameborder="0"
        />
      </div> */}
      <div>
        <div className="relative h-screen">
          <header className="py-3 px-4 fixed top-0 left-0 right-0 ">
            <div className="flex items-center justify-between">
              <img className="w-[20rem]" src={logo} alt="Logo" />
              <div className={"hidden sm:block"}>
                {/* <ConnectMetamask
                  isMetaMaskConnected={isMetaMaskConnected}
                  metaMaskAddress={metaMaskAddress}
                ></ConnectMetamask> */}
              </div>
            </div>
          </header>

          {/* <div className={styles.hdr}>
          <div className={"hidden sm:block"}>
            <ConnectMetamask
              isMetaMaskConnected={isMetaMaskConnected}
              metaMaskAddress={metaMaskAddress}
            ></ConnectMetamask>
          </div>
          <img className={styles.im} src={logo} alt="my-gif" />
        </div> */}
          <div className="flex h-[80%] sm:h-full justify-center items-center p-4">
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
          </div>
          <CupertinoPaneContainer
            refreshToken={"token"}
            parentClass="loginPage"
            className="loginForm"
          >
            <CupertinoPaneContent />
          </CupertinoPaneContainer>
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
