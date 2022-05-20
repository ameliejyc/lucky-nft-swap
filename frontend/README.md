# Lucky NFT Swap Frontend

Taken from the boilerplate React Typescript Ethers.js Hardhat Project (Frontend)

If you haven't already read the Hardhat README for this project, checkout the Hardhat [README.md](https://github.com/ChainShot/hardhat-ethers-react-ts-starter/tree/main/README.md) first and then come back to this README file.

This Dapp was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the Typescript template. Additionally it makes use of the popular [@web3-react](https://www.npmjs.com/package/web3-react) npm package. The Metamask integration code found in this Dapp is heavily based on the code found in the [@web3-react example project](https://github.com/NoahZinsmeister/web3-react/tree/v6/example). For simplicity only the Metamask (injected) blockchain provider is used in this Dapp.

To start the frontend:

1. `cd` to the frontend directory of this project
2. Run `yarn` to install the necessary dependencies
3. `yarn start` to startup the webserver
4. Visit `localhost:3000` in your browser to interact with the browser Dapp and the Greeter contract running on your local Hardhat blockchain.

## Issues during development/learnings

- Metamask has a [bug](https://github.com/MetaMask/metamask-extension/issues/14187) preventing me from approving a token transfer (the extension hangs and shows the error shown on the thread when you open dev tools). I got around it by downgrading Metamask extension to 10.10.2.
- Deploying a test contract on a local Hardhat node on localhost:8545 can take a reeeeeally long time. Importing a different Hardhat address in Metamask and using that sped things up.
