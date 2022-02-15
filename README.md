# bcv-frontend

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contract Management
The Smart Contract lives in a separate repository and has to be considered an external component, especially
once deployed to a net / testnet. In order to access the available calls, the contract's `abi` has to be
present in this repository. The file is to be located under `src/contract/abi/fileName.json`.

This abi has to be updated manually, whenever changes are made to the contract.

The contract address can not necessarily be reliably pulled from the abi (e.g, abi only gets updated when
changes are made to the contract, but simply re-deploying to contract does only alter the address within the
abi). To avoid having to manually replace the abi whenever the contract is redeployed, we have provided an
.env variable `VUE_APP_CONTRACT_ADDRESS` for a more convenient way of communicating contract address changes
to the application.

## Environment Variables
This repository requires two environment variables to be set in the .env file:
* VUE_APP_BACKEND_URL=http(s)://whatever-address-and-port.com/api/v1/bcv
* VUE_APP_CONTRACT_ADDRESS=0xC5......

Note once again, that the contract address provided through this variable is utilized and not the one present
in the contract abi.
