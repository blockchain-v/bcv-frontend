/*
contains variables related to web3.js and connectivity
 */

import Web3 from "web3";
import vnfContractData from "../truffle/build/contracts/VNFDeployment";
import { defaultContractCallParams } from "../constants/truffle";

console.log("vnfContractData in truffleService:", vnfContractData); // TODO: CLEANUP

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

export { VNFContract, getDefaultCallParams };