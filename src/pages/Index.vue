<template>
  <q-page padding>
    <div class="q-mt-xl" v-if="settings === 'false'">
      <q-toolbar>
        <q-toolbar-title>
          Scorer
        </q-toolbar-title>
      </q-toolbar>
      <categoryTabs />
    </div>
    <div v-else class="q-mt-xl">
      <results />
    </div>
  </q-page>
</template>

<script>
import filter from "lodash/filter";
export default {
  name: "PageIndex",
  components: {
    categoryTabs: require("components/categoryTabs").default,
    results: require("components/results").default
  },
  data() {
    return {};
  },
  computed: {
    settings() {
      return this.$store.state.auth.settings;
    },
    listofCategories() {
      return this.$store.state.category.listofCategories;
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    async getCategories() {
      const vm = this;
      this.$q.loadingBar.start();
      this.$q.loading.show();
      await this.$store
        .dispatch("category/getCategoryAction", this.user.eventKeyindex)
        .then(result => {
          this.$q.loading.hide();
          this.$q.loadingBar.stop();
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getCategories();
    this.$store
      .dispatch("auth/getSettings")
      .then(result => {
        this.$q.loading.hide();
        this.$q.loadingBar.stop();
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
