module.exports = {
  compilers: {
    // https://www.trufflesuite.com/docs/truffle/reference/configuration#compiler-configuration
    solc: {
      version: "^0.6.0", // A version or constraint - Ex. "^0.5.0"
      // NOTE: 0.6.0 upwards was the highest version I managed to get to compile.
      parser: "solcjs", // Leverages solc-js purely for speedy parsing
      // evmVersion: "istanbul", // Default: "istanbul"
    },
  },
  networks: {
    development: {
      // TODO: from .env
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
};
