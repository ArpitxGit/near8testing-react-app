// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
//import reportWebVitals from './reportWebVitals';
import "./index.css";

import "0xpass/styles.css";

import { getDefaultWallets, PassProvider } from "0xpass";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import App from "./App";

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit demo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <PassProvider
        apiKey="fc32476c-fda1-4a2e-9884-47a2cfddec4c"
        chains={chains}
      >
        <App />
      </PassProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
