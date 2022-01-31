// inspired by: https://medium.com/notonlycss/how-to-build-an-accordion-component-in-vue-js-570ee594404c
<template>
  <div class="accordion-container">
    <div
      @click="toggle()"
      class="accordion-title"
      v-bind:class="{ open: isOpen, closed: !isOpen }"
    >
      <slot name="title" />
      <i class="caret" v-bind:class="{down: isOpen, up: !isOpen}"/>
    </div>

    <div
      class="accordion-content"
      v-bind:class="{ expanded: isOpen, collapsed: !isOpen }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Accordion",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/global.scss";
.accordion-container {
  width: 100%;
  border-radius: 10px;
  border: 1px solid $green-cadetblue;
  margin: 10px;
}

.accordion-title {
  border: 1px solid $green-cadetblue;
  padding: 5px;
  background-color: $green-mint-tulip;
  z-index:1;
}

.accordion-title.closed {
  border-radius: 10px;
}

.accordion-title.open {
  border-radius: 10px 10px 0px 0px;
}

.accordion-content {
  border: 1px solid $green-cadetblue;
  background-color: $green-white;
  z-index:0;
}

.accordion-content.expanded {
  padding: 5px;
  border-radius: 0px 0px 10px 10px;
}

.accordion-content.collapsed {
  display: none;
}


// inspired by: https://www.w3schools.com/howto/howto_css_arrows.asp
.caret {
    border: solid $green-cadetblue;
    border-width: 0 3px 3px 0;
    padding: 5px;
    margin-right:10px;
    float: right;
}

.up {
    margin-top: 7px;
    transform: rotate(-135deg);
}

.down {
    margin-top: 2px;
    transform: rotate(45deg);
}

</style>
