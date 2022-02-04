require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url:'https://eth-ropsten.alchemyapi.io/v2/KBlydBY06ZVZnlNCF1cVc04zAe6GFyKx',
      accounts: [ 'aff1630eebbc09664bd7b74911f32dd0a0835a05ac8342dd8dd935f5bded5c3b']
    }
  }
}