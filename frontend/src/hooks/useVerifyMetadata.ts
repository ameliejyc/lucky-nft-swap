import { useState } from 'react';
import { resolveIPFSLink } from '../utils/helpers';
import { NFT } from '../components/NftItem';

/**
 * This is a hook that loads the NFT metadata in case it doesn't alreay exist
 * If metadata is missing, the object is replaced with a reactive object that updates when the data becomes available
 * The hook will retry until request is successful (with OpenSea, for now)
 */
export const useVerifyMetadata = () => {
  const [results, setResults] = useState<any>({});

  /**
   * Fetch Metadata from NFT and Cache Results
   * @param {object} nft
   * @returns NFT
   */
  function verifyMetadata(nft: NFT) {
    // Pass through if metadata is already present
    if (nft.metadata) {
      const metadata = JSON.parse(nft.metadata);
      if (metadata?.image) nft.image = resolveIPFSLink(metadata.image);
      return nft;
    }
    // else get metadata
    getMetadata(nft);
    // Return hooked NFT object
    if (nft.token_uri && results?.[nft.token_uri]) {
      return results?.[nft.token_uri];
    }
    return nft;
  }

  /**
   * Extract Metadata from NFT,
   * Fallback: Fetch from URI
   * @param {object} nft
   * @returns void
   */
  async function getMetadata(nft: NFT) {
    // Validate URI
    if (!nft.token_uri || !nft.token_uri.includes('://')) {
      console.log('getMetadata() Invalid URI', { URI: nft.token_uri, nft });
      return;
    }
    //Get Metadata
    fetch(nft.token_uri, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST, GET'
      }
    })
      .then((res) => res.json())
      .then((metadata) => {
        if (!metadata) {
          console.error(
            'useVerifyMetadata.getMetadata() No Metadata found on URI:',
            { URI: nft.token_uri, nft }
          );
        } else if (
          metadata?.detail &&
          metadata.detail.includes('Request was throttled')
        ) {
          console.warn(
            'useVerifyMetadata.getMetadata() Bad Result for:' +
              nft.token_uri +
              '. Will retry later',
            { results, metadata }
          );
          // Retry That Again after 1s
          setTimeout(function () {
            getMetadata(nft);
          }, 1000);
        } // Handle Opensea's {detail: "Request was throttled. Expected available in 1 second."}
        else {
          setMetadata(nft, metadata);
          console.log(
            'getMetadata() Late-load for nft Metadata ' + nft.token_uri,
            { metadata }
          );
        }
      })
      .catch((err) => {
        console.error('useVerifyMetadata.getMetadata() Error Caught:', {
          err,
          nft,
          URI: nft.token_uri
        });
      });
  }

  /**
   * Update nft Object
   * @param {object} nft
   * @param {object} metadata
   */
  function setMetadata(nft: NFT, metadata: any) {
    nft.metadata = metadata;
    if (metadata?.image) nft.image = resolveIPFSLink(metadata.image);
    if (metadata && nft.token_uri && !results[nft.token_uri])
      setResults({ ...results, [nft.token_uri]: nft });
  }

  return { verifyMetadata };
};
