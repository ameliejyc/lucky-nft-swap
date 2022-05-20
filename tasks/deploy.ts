import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy LuckyNftSwap contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const LuckyNftSwap = await hre.ethers.getContractFactory('LuckyNftSwap');
    const luckyNftSwap = await LuckyNftSwap.deploy(4);
    await luckyNftSwap.deployed();

    console.log('LuckyNftSwap deployed to:', luckyNftSwap.address);
  }
);
