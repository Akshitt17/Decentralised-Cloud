module.exports = {
  networks:{
      development: {
          host: '127.0.0.1',
          port: '7545',
          network_id: '*' // match to any network
      },
  },
   contract_build: 'client/.src',
  contracts_build_directory: 'client/src/truffle_abis/',
  compilers: {
      solc: {
          version: "0.8.19",
          optimizer: {
              enabled: true,
              runs: 200
          }
      },
  }
}