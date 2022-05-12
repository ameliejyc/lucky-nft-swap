import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('LuckyNftSwap', function (): void {
  it('Should deploy', async function (): Promise<void> {
    const LuckyNftSwap = await ethers.getContractFactory('LuckyNftSwap');
    const luckyNftSwap = await LuckyNftSwap.deploy();

    await luckyNftSwap.deployed();

    expect(await luckyNftSwap.deposits(0)).to.be.an(`array`);
  });
});
