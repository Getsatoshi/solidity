const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Satoshi', (m) => {
  const deployer = m.getAccount(0);
  const config = require(`../${hre.network.name}.json`);
  const wbtc = config.Satoshi.wbtc;
  const initialOwner = config.Satoshi.initialOwner;
  const createx = m.contractAt('ICreateX', '0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed');
  const salt = `0x58791a0d0911698bce83dca9758d874ef3c1dc06000000000000000000000001`;
  const bytecode = hre.artifacts.readArtifactSync('Satoshi').bytecode;
  const initcode = ethers.concat([
    bytecode,
    ethers.AbiCoder.defaultAbiCoder().encode(['address', 'address'], [wbtc, initialOwner])
  ]);
  const tx = m.call(createx, 'deployCreate3(bytes32,bytes)', [salt, initcode]);
  const deployedAddress = m.readEventArgument(tx, 'ContractCreation(address)', 'newContract');
  const sato = m.contractAt('Satoshi', deployedAddress);

  return { sato };
});
