import { ReactElement } from 'react';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import NftPool from './components/NftPool';
import NftItemList from './components/NftItemList';

const StyledAppDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  margin: auto;
`;

const StyledAppHeader = styled.h1`
  font-size: 3rem;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <StyledAppHeader>Lucky NFT Swap</StyledAppHeader>
      <NftPool />
      <NftItemList />
    </StyledAppDiv>
  );
}
