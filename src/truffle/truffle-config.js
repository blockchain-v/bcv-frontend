module.exports = {
  compilers: {
    // https://www.trufflesuite.com/docs/truffle/reference/configuration#compiler-configuration
    solc: {
      // version: "^0.7.5", // A version or constraint - Ex. "^0.5.0"
      // version: "^0.4.0", // A version or constraint - Ex. "^0.5.0"
      // version: "^0.7.0", // A version or constraint - Ex. "^0.5.0"
      version: "^0.6.0", // A version or constraint - Ex. "^0.5.0"
      // version: "^0.5.0", // A version or constraint - Ex. "^0.5.0"
      // version: "^0.8.4", // A version or constraint - Ex. "^0.5.0"
      // Can be set to "native" to use a native solc or
      // "pragma" which attempts to autodetect compiler versions
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
  },
};
