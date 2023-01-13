import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./Cupertino.module.css";

const CupertinoPaneContent = () => {
  return (
    <>
      <div
        className={classNames(
          "flex",
          "flex-row",
          "justify:spaceBetween",
          styles.audioContainer
        )}
      >
        <audio src="./landing/assets/TeslaPark_splitscreen.m4a"></audio>

        <button
          data-playing="false"
          className="outline-none tape-controls-play"
          role="switch"
          aria-checked="false"
        >
          <span className="icon h-8 w-12"></span>
        </button>
        <div className="cuenta-regresiva font-sans hidden h-8 text-white leading-8 text-5xl"></div>
      </div>
      <div hide-on-bottom>
        <section className="flex flex-col mx-auto bg-grey-light py-20 px-0 md:px-4">
          <label className="flex flex-col mb-5">
            <div className="flex">
              <a
                href="//patreon.com/near8"
                className="mx-auto flex-grow flex justify-center"
              >
                <button className="p-1 sm:p-4 font-sans text-2xl items-center text-white mx-auto flex-grow flex justify-center border bg-transparent border-gray-500">
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
          <label className="mb-5 flex flex-col">
            <form
              className="flex flex-row form-newsletter"
              data-success="Thanks for your registration, we will be in touch shortly."
              data-error="Please fill all fields correctly."
              success-redirect=""
            >
              <input
                className="validate-email m-auto w-3/4 sm:w-full validate-required signup-email-field p-1 sm:p-4 font-sans text-2xl border-brand bg-transparent border leading-none flex-grow"
                name="email"
                type="text"
                placeholder="Subscribe To Email"
              />
              <button
                type="submit"
                className="flex text-white border border-brand bg-black px-2 xs:px-4 sm:px-6 md:px-8"
              >
                <svg
                  className="m-auto fill-brand"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    className="heroicon-ui"
                    d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2zm16 3.38V6H4v1.38l8 4 8-4zm0 2.24l-7.55 3.77a1 1 0 0 1-.9 0L4 9.62V18h16V9.62z"
                  />
                </svg>
              </button>
            </form>
          </label>
          <label className="flex flex-col mb-5">
            <div className="flex">
              <button
                id="aboutCTA"
                className="font-sans text-2xl text-white p-1 sm:p-4 mx-auto flex-grow flex justify-center border bg-transparent border-gray-500"
              >
                <b>ABOUT</b> NEAR8
              </button>
            </div>
          </label>
        </section>
      </div>
      <div className="mx-auto text-white md:px-16 px-4 section">
        <a name="privacy"></a>
        <div className="flex font-bold font-sans justify-center mb-4 md:text-lg text-2xl">
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

        <div className="flex font-bold items-center justify-center flex-wrap font-sans">
          <p className="opacity-75 text-lg md:mb-0 mb-3">
            &copy; 2019 Near8, Inc. All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default CupertinoPaneContent;
