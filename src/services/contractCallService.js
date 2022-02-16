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

export const performContractCall = async (methodId, parameters = null) => {
  console.log(
    "registered call invocation for method id:",
    methodId,
    "with parameters:",
    parameters
  );
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
      await performContractCall_deleteVNF(parameters);
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
    await registerRequest.send(getDefaultCallParams(account));
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_unregister = () => {
  console.log("call for unregister");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    const unregisterRequest = VNFContract.methods.unregisterUser();
    unregisterRequest
      .send(getDefaultCallParams(account))
      .then(() => {
        // only set for showing text if actually confirmed tx in MM
        store.commit("appState/setAwaitingContract", true);
      })
      .catch((error) => {
        console.warn("unregistration transaction failed with error", error);
        store.commit("appState/setIsLoading", false);
      });
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_deployVNF = () => {
  console.log("call for deployVNF");
  const account = store.getters["contracts/getUserETHAccount"];
  if (!_isNil(account)) {
    const callData = store.getters["contracts/getDeployVnfData"];
    const VNFD_ID = callData[fieldNames.VNFDID];
    const parameters = {
      name: callData[fieldNames.NAME],
      description: callData[fieldNames.DESCRIPTION],
    };
    // attributes have to be present no matter what
    parameters["attributes"] = _isNil(callData[fieldNames.ATTRIBUTES])
      ? {}
      : callData[fieldNames.ATTRIBUTES];
    // add config to attributes if present
    const config = callData[fieldNames.CONFIG];
    if (!_isNil(config) && config !== "") {
      parameters["attributes"]["config"] = config;
    }

    const deployVNFrequest = VNFContract.methods.deployVNF(
      VNFD_ID,
      JSON.stringify(parameters)
    );
    console.log("before send", new Date().toISOString());
    deployVNFrequest
      .send(getDefaultCallParams(account))
      .then((res) => {
        console.log("contract response", res, new Date().toISOString());
        // only set for showing text if actually confirmed tx in MM
        store.commit("appState/setAwaitingContract", true);
      })
      .catch((error) => {
        console.warn("deployment transaction failed with error", error);
        store.commit("appState/setIsLoading", false);
      });
  } else {
    console.log("no user account to make call with, rejecting...");
  }
};

const performContractCall_deleteVNF = (parameters) => {
  console.log("call for deleteVNF");
  const account = store.getters["contracts/getUserETHAccount"];
  if (
    !_isNil(account) ||
    !_isNil(parameters) ||
    !_isNil(parameters.deploymentId)
  ) {
    const deleteVNFRequest = VNFContract.methods.deleteVNF(
      parameters.deploymentId
    );
    console.log("before send", new Date().toISOString());
    deleteVNFRequest
      .send(getDefaultCallParams(account))
      .then((res) => {
        // only set for showing text if actually confirmed tx in MM
        console.log("contract response", res, new Date().toISOString());
        store.commit("appState/setAwaitingContract", true);
      })
      .catch((error) => {
        console.warn("deletion transaction failed with error", error);
        store.commit("appState/setIsLoading", false);
      });
  } else {
    console.warn("no user account to make call with, rejecting...");
  }
};

const performContractCall_DEV_getVNFs = async () => {
  console.log("call for DEV_getVNFS");
  const getVNFRequest = VNFContract.methods.getVnfs();
  await getVNFRequest.call();
};
