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
import { v4 as uuidv4 } from "uuid";

export const performContractCall = async (methodId) => {
  console.log("registered call invocation for method id:", methodId);
  switch (methodId) {
    case contractMethodList[0].id:
      // Register
      await performContractCall_register();
      break;
    case contractMethodList[1].id:
      // Unregister
      await performContractCall_unregister();
      break;
    case contractMethodList[2].id:
      await performContractCall_deployVNF();
      // DeployVNF
      break;
    case contractMethodList[3].id:
      await performContractCall_deleteVNF();
      // DeleteVNF
      break;
    case contractMethodList[4].id:
      await performContractCall_DEV_getVNFs();
      // DEV only - getVNFs
      break;
    case contractMethodList[5].id:
      await performContractCall_DEV_getVNFDetails();
      // DEV only - getVNFDetails
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

const performContractCall_deployVNF = async () => {
  console.log("call for deployVNF");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    // TODO: real VNFD-ids from backend
    let VNFD_ID = uuidv4();
    VNFD_ID = "638530e7-1120-41c1-8a03-149b66247d02";
    // TODO: let the user parameters, not VNFDs - that is a different call that goes to
    // the backend
    const parameters = store.getters["contracts/getCurrentVNFDescriptorInput"];
    const deployVNFrequest = VNFContract.methods.deployVNF(VNFD_ID, parameters);
    const deployVNFresult = await deployVNFrequest.send(
      getDefaultCallParams(account)
    );
    // TODO: CLEANUP logs
    console.log("deployVNF", deployVNFresult);
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_deleteVNF = async () => {
  console.log("call for deleteVNF");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    const VNF_toDelete = store.getters["contracts/getCurrentVNFToDelete"];
    const deleteVNFRequest = VNFContract.methods.deleteVNF(VNF_toDelete);
    const deleteVNFResult = await deleteVNFRequest.send(
      getDefaultCallParams(account)
    );
    // TODO: CLEANUP logs
    console.log("unregisterUser", deleteVNFResult);
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_DEV_getVNFs = async () => {
  console.log("call for DEV_getVNFS");
  const getVNFRequest = VNFContract.methods.getVnfs();
  const getVNFResult = await getVNFRequest.call();
  // TODO: CLEANUP logs
  console.log("getVNFs", getVNFResult);
};

const performContractCall_DEV_getVNFDetails = async () => {
  console.log("call for DEV_getVNFDetails");
  const VNF_ID = store.getters["contracts/getCurrentVNFDetailsID"];
  const getVNFDetailsRequest = VNFContract.methods.getVnfDetails(VNF_ID);
  const getVNFDetailsResult = await getVNFDetailsRequest.call();
  // TODO: CLEANUP logs
  console.log("getVNFDetails", getVNFDetailsResult);
};
