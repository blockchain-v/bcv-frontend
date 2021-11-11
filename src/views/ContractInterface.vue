<template>
  <div class="contract-interface">
    <div v-if="contractFound" class="container">
      <h1 class="title">Invoke Contract Calls</h1>
      <div v-for="method in contractMethodList" :key="method.id">
        <div
          class="contract-call-item"
          :class="{ expanded: expandItemList[method.id] }"
        >
          <div
            class="item-text"
            :class="{ expanded: expandItemList[method.id] }"
            @click="toggleItemExpand(method.id)"
          >
            {{ method.displayText }}
          </div>

          <div v-if="expandItemList[method.id]" class="simulated-details">
            <button @click="performContractCall(method.id)">haHaa</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container contract-not-found">
      <h1 class="title">Unable to resolve VNFDeployment Contract address</h1>
      <p>Please contact us if the issue persists</p>
    </div>
  </div>
</template>

<script>
import { VNFContract, getDefaultCallParams } from "../services/truffleService";
import { contractMethodList } from "../constants/contractInterfaceConfig";
import { isNil as _isNil } from "lodash";
import { v4 as uuidv4 } from "uuid";

/*
TODOs:
  - Error handling for contract calls
  - Inputs for those calls that require inputs
 */

export default {
  name: "ContractInterface",
  data() {
    return {
      contractMethodList: contractMethodList,
      expandItemList: {},
      vnfids: [],
    };
  },
  created() {
    this.populateItemList();
  },
  computed: {
    contractFound() {
      return !_isNil(VNFContract._address);
    },
  },
  methods: {
    // ---------------- UI Helpers -------------------------------------------------------------------------------------
    populateItemList() {
      // TODO: this should be handled in the store, not in data
      contractMethodList.forEach(
        (method) => (this.expandItemList[method.id] = false)
      );
    },
    toggleItemExpand(methodId) {
      this.expandItemList[methodId] = !this.expandItemList[methodId];
    },

    // ---------------- CONTRACT HELPERS -------------------------------------------------------------------------------
    async getAccount() {
      /*
      TODO: perhaps if multiple accounts detected (e.g., on navigation or created), ask user
        to select the account to be used for calls.
      */

      // grab account with which to perform call
      const accounts = await window.web3.eth.getAccounts();
      return accounts[0];
    },

    // ---------------- CONTRACT CALLS ---------------------------------------------------------------------------------
    performContractCall(methodId) {
      console.log("registered call invocation for method id:", methodId);
      switch (methodId) {
        case contractMethodList[0].id:
          // Register
          this.performContractCall_register();
          break;
        case contractMethodList[1].id:
          // Unregister
          this.performContractCall_unregister();
          break;
        case contractMethodList[2].id:
          this.performContractCall_deployVNF();
          // DeployVNF
          break;
        case contractMethodList[3].id:
          this.performContractCall_deleteVNF();
          // DeleteVNF
          break;
        default:
          console.log(
            "unable to identify method to be used with methodId",
            methodId
          );
          break;
      }
    },
    async performContractCall_register() {
      const account = await this.getAccount();
      // TODO: not sure which signature method to use here yet. currently just signs
      // address with address (lmao?)
      // https://ethereum.stackexchange.com/a/25610
      const msg = account;
      const signedAddress = await window.web3.eth.sign(
        window.web3.utils.sha3(msg),
        account
      );
      const registerRequest = await VNFContract.methods.registerUser(
        signedAddress
      );
      const registerResult = await registerRequest.send(
        getDefaultCallParams(account)
      );
      console.log("result of registration call:", registerResult);
      // TODO: CLEANUP
    },
    async performContractCall_unregister() {
      const account = await this.getAccount();
      const unregisterRequest = VNFContract.methods.unregisterUser();
      const unregisterResult = await unregisterRequest.send(
        getDefaultCallParams(account)
      );
      console.log("result of unregistration call:", unregisterResult);
    },
    async performContractCall_deployVNF() {
      const account = await this.getAccount();
      const VNFD_ID = uuidv4(); // TODO: get list from backend
      const parameters = {
        brot: "vollkorn",
        fuellung: ["salami", "gurken", "yoghurt-sauce"],
        laenge: 15,
      };

      const deployRequest = VNFContract.methods.deployVNF(VNFD_ID, parameters);
      const deployResult = await deployRequest.send(
        getDefaultCallParams(account)
      );
      console.log("result of VNF deployment call:", deployResult);
      this.vnfids.push(deployResult.events.DeployVNF.returnValues.vnfId); // TODO: CLEANUP
    },
    async performContractCall_deleteVNF() {
      const account = await this.getAccount();

      if (this.vnfids.length > 0) {
        const VNF_ID = this.vnfids[0]; // TODO CLEANUP
        const deleteRequest = VNFContract.methods.deleteVNF(VNF_ID);
        const deleteResult = await deleteRequest.send(
          getDefaultCallParams(account)
        );
        this.vnfids.splice(0, 1);
        console.log("result of VNF deletion call:", deleteResult);
      } else {
        console.log("rejected invocation of deletion call, no vnfids known");
      }

      // const deleteRequest = VNFContract.methods.deleteVNF(VNF_ID);
      // const deleteResult = await deleteRequest.send(
      //   getDefaultCallParams(account)
      // );
      // console.log("result of VNF deletion call:", deleteResult);
    },
  },
};
</script>

<style scoped lang="scss">
.contract-interface {
  .container {
    border: 2px solid cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.contract-not-found {
      border: 2px solid red;
      background-color: darksalmon;
    }

    .title {
      margin-bottom: 40px;
    }

    .contract-call-item {
      font-size: 18px;
      cursor: pointer;
      margin: 10px 30px;
      display: flex;
      align-items: center;
      flex-direction: column;

      &.expanded {
        background-color: #f7fffd;
        border: 2px solid aquamarine;
      }

      .item-text {
        &.expanded {
          font-weight: bold;
          color: #2c3e50;
          border-bottom: 1px solid #2c3e50;
          padding: 0 4px 4px;
        }
      }

      .simulated-details {
        margin: 30px 0;
        width: 100%;
        height: fit-content;
      }
    }
  }
}
</style>
