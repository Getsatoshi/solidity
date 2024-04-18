const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const MockWBTC = require('./MockWBTC');
const Satoshi = require('./Satoshi');

module.exports = buildModule('TestWrap', (m) => {
  const deployer = m.getAccount(0);
  const { mock } = m.useModule(MockWBTC);
  const { sato } = m.useModule(Satoshi);

  const tx1 = m.call(mock, 'mint', [deployer, 1000n]);
  const tx2 = m.call(mock, 'approve', [sato, 1000n], {after: [tx1]});
  const tx3 = m.call(sato, 'depositFor', [deployer, 1000n], {after: [tx2]});
  const tx4 = m.call(sato, 'withdrawTo', [deployer, 1000n], {after: [tx3]});

  return { sato };
});
