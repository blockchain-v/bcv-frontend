// inspired by:
https://medium.com/notonlycss/how-to-build-an-accordion-component-in-vue-js-570ee594404c
<template>
  <div class="accordion-container">
    <div
      @click="toggle()"
      class="accordion-title"
      :class="{ open: isExpanded }"
    >
      <slot name="title" />
      <i class="caret" :class="{ down: isExpanded }" />
    </div>

    <div class="accordion-content" :class="{ expanded: isExpanded }">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Accordion",
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";
.accordion-container {
  border-radius: 10px;
  border: 1px solid $green-cadetblue;
  margin: 10px;
}

.accordion-title {
  border: 1px solid $green-cadetblue;
  padding: 5px;
  background-color: $green-mint-tulip;
  z-index: 1;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;

  &.open {
    border-radius: 8px 8px 0px 0px;
  }
}

.accordion-content {
  background-color: $green-white;
  z-index: 0;
  overflow: hidden;
  border: 0px;
  max-height: 0;

  &.expanded {
    overflow: visible;
    max-height: fit-content;
    border: 1px solid $green-cadetblue;
    padding: 5px;
    border-radius: 0px 0px 10px 10px;
  }
}

// inspired by: https://www.w3schools.com/howto/howto_css_arrows.asp
.caret {
  border: solid $green-cadetblue;
  border-width: 0 3px 3px 0;
  padding: 5px;
  margin-right: 10px;
  float: right;
  transition: all 0.2s ease-out;
  margin-top: 7px;
  transform: rotate(-135deg);

  &.down {
    margin-top: 2px;
    transform: rotate(45deg);
  }
}
</style>
