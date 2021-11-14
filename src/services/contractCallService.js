/*
Service exposes generic performContractCall function which then internally
resolves to the methodId-specific contract call.

Since different calls require/write different data from different components,
the state is managed using the Vuex store.
*/

import { contractMethodList } from "../constants/contractInterfaceConfig";
import store from "../store/store.js";
import { isNil as _isNil } from "lodash";
import { getDefaultCallParams, VNFContract } from "./truffleService";

export const performContractCall = async (methodId) => {
  console.log("registered call invocation for method id:", methodId);
  switch (methodId) {
    case contractMethodList[0].id:
      // Register
      await performContractCall_register();
      break;
    case contractMethodList[1].id:
      // Unregister
      performContractCall_unregister();
      break;
    case contractMethodList[2].id:
      performContractCall_deployVNF();
      // DeployVNF
      break;
    case contractMethodList[3].id:
      performContractCall_deleteVNF();
      // DeleteVNF
      break;
    default:
      console.log(
        "unable to identify method to be used with methodId",
        methodId
      );
      break;
  }
};

// methodId-specific calls

const performContractCall_register = async () => {
  console.log("call for register");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    const signedAddress = await window.web3.eth.sign(
      window.web3.utils.sha3(account),
      account
    );
    const registerRequest = VNFContract.methods.registerUser(signedAddress);
    const registerResult = await registerRequest.send(
      getDefaultCallParams(account)
    );
    // TODO: CLEANUP logs
    console.log("registerUser", registerResult);
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_unregister = async () => {
  console.log("call for unregister");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    const unregisterRequest = VNFContract.methods.unregisterUser();
    const unregisterResult = await unregisterRequest.send(
      getDefaultCallParams(account)
    );
    // TODO: CLEANUP logs
    console.log("unregisterUser", unregisterResult);
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

function performContractCall_deployVNF() {
  console.log("call for deployVNF");
}

function performContractCall_deleteVNF() {
  console.log("call for deleteVNF");
}
