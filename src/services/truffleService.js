/*
contains variables related to web3.js and connectivity
 */

import Web3 from "web3";
import vnfContractData from "../../../bcv-contract/src/build/contracts/VNFDeployment.json";
import { defaultContractCallParams } from "../constants/truffle";

window.web3 = new Web3(window.ethereum);
window.ethereum.enable();

// RPC server from GANACHE,
window.web3.eth.defaultAccount = window.web3.eth.accounts[0];

let vnfContractABI = vnfContractData.abi;
// TODO: the network may have to be solved via .env. not sure yet
let vnfContractAddress = vnfContractData.networks[5777].address;

const VNFContract = new window.web3.eth.Contract(
  vnfContractABI,
  vnfContractAddress
);

function getDefaultCallParams(account) {
  return {
    from: account,
    gasPrice: window.web3.gasPrice,
    gasLimit: defaultContractCallParams.GAS_LIMIT,
  };
}

async function getAccount() {
  // grab account with which to perform call
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}

function registerEventListener(
  eventType,
  callback,
  filter = { filter: { user: [window.web3.eth.defaultAccount] } }
) {
  eventType(filter, callback);
}

export { VNFContract, getDefaultCallParams, registerEventListener, getAccount };
