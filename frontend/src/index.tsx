import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';
import { getProvider } from './utils/provider';
import { MoralisProvider } from 'react-moralis';

const REACT_APP_MORALIS_APPLICATION_ID =
  '0wNpFu7IYWXSRUmXjqgUWA7s2aZ3Hp2qsGMrA7Ip';
const REACT_APP_MORALIS_SERVER_URL =
  'https://5t2mvomzsrnd.usemoralis.com:2053/server';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      <MoralisProvider
        serverUrl={REACT_APP_MORALIS_SERVER_URL}
        appId={REACT_APP_MORALIS_APPLICATION_ID}
      >
        <App />
      </MoralisProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
