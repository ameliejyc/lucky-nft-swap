import styled from 'styled-components';
import imageFallback from '../imageFallback.svg';
import { getExplorer } from '../utils/helpers';

export interface NFT {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  synced_at?: string | undefined;
  amount?: string | undefined;
  image?: string;
  name: string;
  symbol: string;
}

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 400px;
  height: auto;
  border: 2px solid yellow;
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  width: auto;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0.5rem;
  border-color: black;
  background-color: white;
`;

const StyledImage = styled.img`
  height: 150px;
  margin-bottom: 0.5rem;
  background-color: #ff9955;
`;

const NftItem = ({ nft, chainId }: any) => {
  return (
    <StyledCard>
      <a
        href={`${getExplorer(chainId)}address/${nft.token_address}`}
        target="_blank"
        rel="noreferrer"
      >
        <StyledImage
          src={nft.image || nft.metadata?.image || imageFallback}
          alt={`Image of nft from ${nft.name}`}
        />
      </a>
      <a
        href={`${getExplorer(chainId)}address/${nft.token_address}`}
        target="_blank"
        rel="noreferrer"
      >
        <strong>{nft.name}</strong>
      </a>
      <StyledButton>Add to lucky swap!</StyledButton>
    </StyledCard>
  );
};

export default NftItem;
