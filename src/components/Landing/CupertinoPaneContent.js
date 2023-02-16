import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./Cupertino.module.css";
import ConnectMetamask from "./ConnectMetamask";
import { connect } from "react-redux";

function CupertinoPaneContent({ isMetaMaskConnected, metaMaskAddress, table }) {
  /**
   * logging in, signing up, and connecting to Metamask with near8's socials.
   */
  return (
    <>
      <div
        className={classNames(
          "justify:spaceBetween",
          "margin-auto",
          "py-[1em]"
        )}
      >
        <div hide-on-bottom={"true"}></div>
        <div className="mx-auto text-white md:px-16 px-4 section justify-center">
          <ConnectMetamask
            inline="true"
            isMetaMaskConnected={isMetaMaskConnected}
            metaMaskAddress={metaMaskAddress}
          ></ConnectMetamask>
          <label className="flex flex-col bg-black">
            <div className="flex">
              <a
                href="https://linktr.ee/near8"
                className="mx-auto flex-grow flex justify-center"
              >
                <button className="p-1 sm:p-4 text-2xl items-center text-white mx-auto flex-grow flex justify-center border bg-transparent border-gray-500">
                  <svg
                    className="p-1 fill-current text-white opacity-50 hover:opacity-75"
                    width="24"
                    viewBox="0 0 100 96"
                  >
                    <g fillRule="evenodd"></g>
                  </svg>
                  <b>FOLLOW</b>SOCIALS
                </button>
              </a>
            </div>
          </label>

          <label className="flex flex-col bg-black">
            <div className="flex">
              <a
                href="//patreon.com/near8"
                className="mx-auto flex-grow flex justify-center"
              >
                <button className="p-1 sm:p-4 text-2xl items-center text-white mx-auto flex-grow flex justify-center border bg-transparent border-gray-500">
                  <svg
                    className="p-1 fill-current text-white opacity-50 hover:opacity-75"
                    width="24"
                    viewBox="0 0 100 96"
                  >
                    <g fillRule="evenodd">
                      <path d="M64.1102,0.1004 C44.259,0.1004 28.1086,16.2486 28.1086,36.0986 C28.1086,55.8884 44.259,71.989 64.1102,71.989 C83.9,71.989 100,55.8884 100,36.0986 C100,16.2486 83.9,0.1004 64.1102,0.1004" />
                      <polygon points=".012 95.988 17.59 95.988 17.59 .1 .012 .1" />
                    </g>
                  </svg>
                  <b>SUPPORT</b> ON PATREON
                </button>
              </a>
            </div>
          </label>
          <a name="privacy"></a>
          <div className="flex font-bold justify-center mb-4 md:text-lg text-2xl">
            <a
              href="https://app.termly.io/document/privacy-policy/35505bae-3bc2-424b-abb8-cdbd69920641"
              target="_blank"
            >
              Privacy Policy
            </a>
            <span className="px-1">|</span>
            <a href="near8-tos.pdf" target="_blank">
              Terms of Service
            </a>
            <span className="px-1">|</span>
            <a href="#privacy">Manage Cookie Preferences</a>
          </div>

          <div className="flex font-bold items-center justify-center flex-wrap ">
            <p className="opacity-75 text-lg md:mb-0 mb-3">
              &copy; 2023 Near8, Inc. All Rights Reserved
            </p>
          </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CupertinoPaneContent);
