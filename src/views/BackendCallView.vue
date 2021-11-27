<template>
  <div class="backend-interface">
    <div class="container">
      <h1 class="title">Perform API calls</h1>
      <hr class="horizontal-divider" />
    </div>
  </div>
</template>

<script>
import { apiCall_GET_vnfd } from "../services/apiCallService";

export default {
  name: "BackendCallView.vue",
  components: {},
  methods: {
    handleClick() {
      apiCall_GET_vnfd();
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.backend-interface {
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

    &.error {
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

    .subtitle {
      font-size: 18px;
    }

    .title {
      margin-bottom: 40px;
      &.has-subtext {
        margin-bottom: unset;
      }
    }

    .horizontal-divider {
      margin-bottom: 20px;
      font-size: 10px;
      background-color: $green-white;
    }

    .backend-call-item-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .backend-call-item {
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
