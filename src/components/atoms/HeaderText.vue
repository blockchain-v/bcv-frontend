<template>
  <div v-if="text" class="header-text">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "HeaderText",
  props: {
    text: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss"></style>
