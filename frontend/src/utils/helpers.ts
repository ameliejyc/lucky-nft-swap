export const networkConfigs: { [key: number]: any } = {
  1: {
    network: 'eth',
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/',
    wrapped: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  3: {
    network: 'ropsten',
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://ropsten.etherscan.io/'
  },
  4: {
    network: 'rinkeby',
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://rinkeby.etherscan.io/'
  },
  5: {
    network: 'goerli',
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io/'
  }
};

export const getExplorer = (chain: number | undefined) =>
  chain && networkConfigs[chain]?.blockExplorerUrl;

export const getNetwork = (chain: number | undefined) =>
  chain && networkConfigs[chain]?.network;

export const resolveIPFSLink = (url: string): string => {
  if (!url || !url.includes('ipfs://')) return url;
  return url.replace('ipfs://', 'https://gateway.ipfs.io/ipfs/');
};
