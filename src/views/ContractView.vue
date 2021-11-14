<template>
  <div class="contract-interface">
    <div v-if="isLoading" class="loading-container">
      <PulseLoader />
    </div>

    <div v-else-if="!ethereumAccountIsKnown" class="container">
      <h1 class="title">No Ethereum Account Detected</h1>
      <p>Please use Metamask to set up a connection with an account</p>
      <p>
        The MetaMask extension should open automatically. If it does not, press
        the button below
      </p>
      <div class="button-container">
        <CustomButton
          @click="connectMetaMask"
          button-text="Connect to Metamask"
        />
      </div>
    </div>

    <div v-else-if="contractFound && ethereumAccountIsKnown" class="container">
      <h1 class="title">Invoke Contract Calls</h1>
      <div
        class="contract-call-item-container"
        v-for="method in contractMethodList"
        :key="method.id"
      >
        <div
          class="contract-call-item"
          :class="{ expanded: expandItemList[method.id] }"
        >
          <div
            class="item-title"
            :class="{ expanded: expandItemList[method.id] }"
            @click="toggleItemExpand(method.id)"
          >
            {{ method.displayText }}
          </div>

          <div v-if="expandItemList[method.id]" class="details">
            <ContractInterfaceResolver :method-id="method.id" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!contractFound" class="container contract-not-found">
      <h1 class="title">Unable to resolve VNFDeployment Contract address</h1>
      <p>Please contact us if the issue persists</p>
    </div>
  </div>
</template>

<script>
import { VNFContract } from "../services/truffleService";
import { contractMethodList } from "../constants/contractInterfaceConfig";
import ContractInterfaceResolver from "../components/ContractInterfaceResolver";
import { isNil as _isNil } from "lodash";
// import { v4 as uuidv4 } from "uuid";
import CustomButton from "../components/atoms/CustomButton";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

/*
TODO:
  - Debug weird error when manually triggering MM
    - reject automatic connection
    - initiate via button
    - still yields errors
 */

export default {
  name: "ContractInterface",
  components: {
    ContractInterfaceResolver,
    CustomButton,
    PulseLoader,
  },
  data() {
    return {
      contractMethodList: contractMethodList,
      expandItemList: {},
      vnfids: [],
      isLoading: true,
    };
  },
  async created() {
    this.isLoading = true;
    this.populateItemList();
    // window.ethereum.on('accountsChanged', this.handleAccountChange)
    // TODO: investigate some more, unable to make it work so far,
    //  https://ethereum.stackexchange.com/a/42810
    //  sticking with alternative below

    // NOTE: working, but polling :(
    let account = await this.getAccount().then(() => {
      if (_isNil(account)) {
        console.log("on created, no MM account found");
        setInterval(async () => {
          account = await this.getAccount();
          if (!_isNil(account) && account !== this.ethereumAccount) {
            console.log("found new MM account/address:", account);
            await this.setAccountToStore(account);
          }
        }, 200);
        this.isLoading = false;
      } else {
        this.setAccountToStore(account);
        this.isLoading = false;
      }
    });
  },
  computed: {
    contractFound() {
      return !_isNil(VNFContract._address);
    },
    ethereumAccount() {
      return this.$store.state.contracts.userETHAccount;
    },
    ethereumAccountIsKnown() {
      return !_isNil(this.ethereumAccount);
    },
  },
  methods: {
    // ---------------- UI Helpers -------------------------------------------------------------------------------------
    populateItemList() {
      // TODO: this should be handled in the store, not in data (maybe)
      contractMethodList.forEach(
        (method) => (this.expandItemList[method.id] = false)
      );
    },
    toggleItemExpand(methodId) {
      this.expandItemList[methodId] = !this.expandItemList[methodId];
    },
    // ---------------- CONTRACT/METAMASK HELPERS ----------------------------------------------------------------------
    async getAccount() {
      /*
      TODO: perhaps if multiple accounts detected (e.g., on navigation or created), ask user
        to select the account to be used for calls.
      */

      // grab account with which to perform call
      const accounts = await window.web3.eth.getAccounts();
      return accounts[0];
    },
    async setAccountToStore(account) {
      await this.$store.dispatch("contracts/setUserETHAccount", account);
    },
    connectMetaMask() {
      window.ethereum.request({ method: "eth_requestAccounts" });
    },
    // handleAccountChange(accounts) {
    //   console.log("account change emit result: ", accounts);
    // },
    // ---------------- CONTRACT CALLS ---------------------------------------------------------------------------------
    // performContractCall(methodId) {
    //   console.log("registered call invocation for method id:", methodId);
    //   switch (methodId) {
    //     case contractMethodList[0].id:
    //       // Register
    //       this.performContractCall_register();
    //       break;
    //     case contractMethodList[1].id:
    //       // Unregister
    //       this.performContractCall_unregister();
    //       break;
    //     case contractMethodList[2].id:
    //       this.performContractCall_deployVNF();
    //       // DeployVNF
    //       break;
    //     case contractMethodList[3].id:
    //       this.performContractCall_deleteVNF();
    //       // DeleteVNF
    //       break;
    //     default:
    //       console.log(
    //         "unable to identify method to be used with methodId",
    //         methodId
    //       );
    //       break;
    //   }
    // },
    // async performContractCall_register() {
    //   const account = await this.getAccount();
    //   // TODO: not sure which signature method to use here yet. currently just signs
    //   // address with address (lmao?)
    //   // https://ethereum.stackexchange.com/a/25610
    //   const signedAddress = await window.web3.eth.sign(
    //     window.web3.utils.sha3(account),
    //     account
    //   );
    //   const registerRequest = VNFContract.methods.registerUser(signedAddress);
    //   const registerResult = await registerRequest.send(
    //     getDefaultCallParams(account)
    //   );
    //   console.log("result of registration call:", registerResult);
    //   // TODO: CLEANUP
    // },
    // async performContractCall_unregister() {
    //   const account = await this.getAccount();
    //   const unregisterRequest = VNFContract.methods.unregisterUser();
    //   const unregisterResult = await unregisterRequest.send(
    //     getDefaultCallParams(account)
    //   );
    //   console.log("result of unregistration call:", unregisterResult);
    // },
    // async performContractCall_deployVNF() {
    //   const account = await this.getAccount();
    //   const VNFD_ID = uuidv4(); // TODO: get list from backend
    //   const parameters = {
    //     brot: "vollkorn",
    //     fuellung: ["salami", "gurken", "yoghurt-sauce"],
    //     laenge: 15,
    //   };
    //
    //   const deployRequest = VNFContract.methods.deployVNF(VNFD_ID, parameters);
    //   const deployResult = await deployRequest.send(
    //     getDefaultCallParams(account)
    //   );
    //   console.log("result of VNF deployment call:", deployResult);
    //   this.vnfids.push(deployResult.events.DeployVNF.returnValues.vnfId); // TODO: CLEANUP
    // },
    // async performContractCall_deleteVNF() {
    //   const account = await this.getAccount();
    //
    //   if (this.vnfids.length > 0) {
    //     const VNF_ID = this.vnfids[0]; // TODO CLEANUP
    //     const deleteRequest = VNFContract.methods.deleteVNF(VNF_ID);
    //     const deleteResult = await deleteRequest.send(
    //       getDefaultCallParams(account)
    //     );
    //     this.vnfids.splice(0, 1);
    //     console.log("result of VNF deletion call:", deleteResult);
    //   } else {
    //     console.log("rejected invocation of deletion call, no vnfids known");
    //   }
    //
    //   // const deleteRequest = VNFContract.methods.deleteVNF(VNF_ID);
    //   // const deleteResult = await deleteRequest.send(
    //   //   getDefaultCallParams(account)
    //   // );
    //   // console.log("result of VNF deletion call:", deleteResult);
    // },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.contract-interface {
  .loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.contract-not-found {
      border: 2px solid $red;
      background-color: $red-salmon;
    }

    .button-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 50px 0 30px;
    }

    .title {
      margin-bottom: 40px;
    }

    .contract-call-item-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .contract-call-item {
        font-size: 18px;
        cursor: pointer;
        margin: 10px 30px 50px;
        display: flex;
        align-items: center;
        flex-direction: column;
        width: fit-content;

        &.expanded {
          background-color: $green-white;
          border: 2px solid $green-aquamarine;
          width: 100%;
          cursor: unset;
        }

        .item-title {
          cursor: pointer;

          &.expanded {
            font-weight: bold;
            color: $vue-darkblue;
            border-bottom: 1px solid $vue-darkblue;
            padding: 0 4px 4px;
          }
        }

        .details {
          margin: 10px 0 30px 0;
          width: 100%;
          height: fit-content;
        }
      }
    }
  }
}
</style>
