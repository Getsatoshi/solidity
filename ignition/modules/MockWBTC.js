const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('MockWBTC', (m) => {
  const config = require(`../${hre.network.name}.json`);
  const mock = m.contractAt('MockWBTC', config.Satoshi.wbtc);

  return { mock };
});
