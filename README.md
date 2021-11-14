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
Put your contracts into `src/truffle/contracts`. To compile `cd` into
`src/truffle` and run
```
truffle compile
```

After successful compilation, run migration to deploy the contracts
```
truffle migrate --reset
```
The `--reset` flag will make sure the contracts are fully migrated even if previous
versions are already present on the network.

For local development simply open up Ganache with Quickstart. Alternatively, 
create a workspace in Ganache and import the `truffle-config.js` for more detailed
info within Ganache.

// TODO: how to when deployed etc.
