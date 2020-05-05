<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>
        Final Results
      </q-toolbar-title>
    </q-toolbar>
    <categoryTabs></categoryTabs>
  </div>
</template>

<script>
export default {
  components: {
    categoryTabs: require("components/results/categoryTabs").default
  }
};
</script>

<style lang="scss" scoped></style>
