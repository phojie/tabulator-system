<template>
  <q-card flat class="shadow-1">
    <!-- <pre>
      {{listofCategories}}
    </pre>-->
    <q-tabs
      dense
      v-model="tab"
      align="justify"
      active-color="white"
      active-bg-color="indigo"
      indicator-color="indigo"
    >
      <q-tab
        v-for="(dataCateg, index) in listofCategories"
        :key="dataCateg.keyIndex"
        :name="index"
        :label="dataCateg.name"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel
        v-for="(dataCateg, index) in listofCategories"
        :key="dataCateg.keyIndex"
        :name="index"
        class="q-pa-none"
      >
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-tabs
              active-bg-color="indigo-1"
              v-model="innerTab"
              vertical
              class="text-indigo"
            >
              <q-tab
                name="Male"
                icon="las la-male"
                no-caps
                class="text-capitalize"
                label="Male"
              />
              <q-tab
                name="Female"
                icon="las la-female"
                no-caps
                class="text-capitalize"
                label="Female"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="innerTab"
              animated
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="Male">
                <categTableScore
                  :gender="'Male'"
                  :tab="tab"
                  :dataCateg="dataCateg"
                />
              </q-tab-panel>
              <q-tab-panel name="Female">
                <categTableScore
                  :gender="'Female'"
                  :tab="tab"
                  :dataCateg="dataCateg"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import filter from "lodash/filter";
export default {
  components: {
    categTableScore: require("components/categTableScore.vue").default
  },
  data() {
    return {
      tab: 0,
      innerTab: "Male",
      splitterModel: 20,
      listofCategory: [
        {
          name: "test"
        }
      ]
    };
  },
  computed: {
    listofCategories() {
      let data = filter(
        this.$store.state.category.listofCategories,
        "keyIndex"
      );
      return data;
    }
  }
};
</script>
