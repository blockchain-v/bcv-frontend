/*
Service exposes generic performContractCall function which then internally
resolves to the methodId-specific contract call.

Since different calls require/write different data from different components,
the state is managed using the Vuex store.
*/

import {
  actionIDs,
  BACKEND_STORE_FIELD_NAMES as fieldNames,
} from "../constants/interfaceConfig";
import store from "../store/store.js";
import { isNil as _isNil } from "lodash";
import { getDefaultCallParams, VNFContract } from "./truffleService";

export const performContractCall = async (methodId) => {
  console.log("registered call invocation for method id:", methodId);
  switch (methodId) {
    case actionIDs.REGISTER:
      // Register
      await performContractCall_register();
      store.commit("appState/setWaitingForContractFeedback", true);
      break;
    case actionIDs.UNREGISTER:
      // Unregister
      await performContractCall_unregister();
      break;
    case actionIDs.DEPLOY_VNF:
      await performContractCall_deployVNF();
      // DeployVNF
      break;
    case actionIDs.DELETE_VNF:
      await performContractCall_deleteVNF();
      // DeleteVNF
      break;
    case actionIDs.DEV__GET_VNFS:
      await performContractCall_DEV_getVNFs();
      // DEV only - getVNFs
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
    const callData = store.getters["contracts/getDeployVnfData"];
    const VNFD_ID = callData[fieldNames.VNFDID];
    const parameters = {
      name: callData[fieldNames.NAME],
      description: callData[fieldNames.DESCRIPTION],
      // TODO: need to stringify? previously with multiline input was not stored as json,
      //  but rather as string
      attributes: callData[fieldNames.ATTRIBUTES],
    };
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
