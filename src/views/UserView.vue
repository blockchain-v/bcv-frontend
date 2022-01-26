<template>
  <div class="user-view">
    <div class="container">
      <h1 class="title">User Options</h1>
      <hr class="horizontal-divider" />
      <UnregisterUser />
    </div>
  </div>
</template>

<script>
import UnregisterUser from "../components/contractInterfaces/UnregisterUser";

export default {
  name: "UserView",
  components: {
    UnregisterUser,
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";

.user-view {
  .container {
    border: 2px solid $green-cadetblue;
    margin: 40px 100px;
    padding: 20px 50px;

    &.error {
      border: 2px solid $red;
      background-color: $red-salmon;
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
  }
}
</style>
