import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('LuckyNftSwap', function (): void {
  it('Should deploy', async function (): Promise<void> {
    const LuckyNftSwap = await ethers.getContractFactory('LuckyNftSwap');
    const luckyNftSwap = await LuckyNftSwap.deploy([2]);

    await luckyNftSwap.deployed();

    expect(await luckyNftSwap.getDeposits()).to.be.an(`array`);
  });
});
