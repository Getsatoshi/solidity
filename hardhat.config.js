require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.25',
    settings: {
      optimizer: { enabled: true, runs: 1000000 },
      evmVersion: 'cancun',
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
    },
    hardhat: {
      chainId: 11155111,
      forking: {
        url: process.env.SEPOLIA_URL,
      },
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY,
          balance: '10000000000000000000000',
        },
      ],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_URL || '',
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_URL || '',
      accounts: [process.env.PRIVATE_KEY],
      gas: 3000000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
