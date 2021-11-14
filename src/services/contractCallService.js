/*
Service exposes generic performContractCall function which then internally
resolves to the methodId-specific contract call.

Since different calls require/write different data from different components,
the state is managed using the Vuex store.
*/

import { contractMethodList } from "../constants/contractInterfaceConfig";
import store from "../store/store.js";

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
  const data = store.getters["contracts/getTest"];
  console.log("state before call", data);

  const account = store.getters["contracts/getUserETHAccount"];
  console.log("found account in store", account)
  const accs = await window.web3.eth.getAccounts();
  const acc = accs[0];
  console.log("found accounts from window", acc, accs);
};

function performContractCall_unregister() {
  console.log("call for unregister");
}

function performContractCall_deployVNF() {
  console.log("call for deployVNF");
}

function performContractCall_deleteVNF() {
  console.log("call for deleteVNF");
}
