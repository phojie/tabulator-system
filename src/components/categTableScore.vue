<template>
  <div>
    <pre>{{MaleData}}</pre>
    <q-table
      v-if="gender === 'Male' && isDone"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :data="MaleData"
      :columns="columns"
      row-key="index"
      separator="cell"
      flat
    >
      <template v-slot:top>
        <q-toolbar class="q-px-none">
          <q-toolbar-title>Male Category</q-toolbar-title>
        </q-toolbar>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">{{ props.row.index }}.</q-td>
          <q-td key="name" @click="viewProfile(props.row)" :props="props">
            {{
            props.row.name
            }}
          </q-td>

          <q-td v-for="datatestLORD in props.row.criteriaLists" :key="datatestLORD.name">
            {{datatestLORD.score}}
            <q-input v-model.number="datatestLORD.score" dense type="number" />
            <!-- <q-popup-edit
              buttons
              label-set="Save"
              @save="saveScore(props.row)"
              v-model.number="criteria.score"
            >
              <template slot="title">
                <div class="text-subtitle2">
                  <span class="text-indigo text-caption">{{ props.row.name }}'s</span>
                  score
                </div>
              </template>
              <q-input v-model.number="criteria.score" dense autofocus type="number" />
            </q-popup-edit>-->
          </q-td>
          <q-td key="score" :props="props">{{totalScore(props.row)}}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table
      v-if="gender === 'Female'"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :data="FemaleData"
      :columns="columns"
      row-key="index"
      separator="cell"
      flat
    >
      <template v-slot:top>
        <q-toolbar class="q-px-none">
          <q-toolbar-title>Female Category</q-toolbar-title>
        </q-toolbar>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">{{ props.row.index }}.</q-td>
          <q-td key="name" @click="viewProfile(props.row)" :props="props">
            {{
            props.row.name
            }}
          </q-td>
          <q-td key="score" :props="props">
            {{ props.row.score }}
            <q-popup-edit
              buttons
              label-set="Save"
              @save="saveScore(props.row)"
              v-model="props.row.score"
            >
              <template slot="title">
                <div class="text-subtitle2">
                  <span class="text-indigo text-caption">{{ props.row.name }}'s</span>
                  score
                </div>
              </template>
              <q-input v-model="props.row.score" dense autofocus type="number" />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-inner-loading :showing="pageLoading">
      <q-spinner-pie size="150px" color="primary" />
    </q-inner-loading>

    <q-dialog v-model="viewProfileDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <div class="col-xs-12">
          <q-img
            :src="listDetails.profileimg"
            class="rounded-borders"
            :ratio="1"
            spinner-color="primary"
          >
            <div class="absolute-bottom text-caption text-weight-bolder cursor-pointer ellipsis">
              <span v-if="listDetails.Gender === 'Male'">Mr.</span>
              <span v-else>Ms.</span>
              {{ listDetails.fullname }}
              <q-tooltip>Mr. {{ listDetails.fullname }}</q-tooltip>
            </div>
          </q-img>

          <q-card-section>
            <span class="text-h6 text-indigo-9">❝</span>
            <span class="text-caption text-justify">
              {{
              listDetails.quotes
              }}
            </span>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import filter from "lodash/filter";
import forEach from "lodash/forEach";
import findIndex from "lodash/findIndex";
import find from "lodash/find";
import vue from "vue";

export default {
  props: ["gender", "dataCateg", "tab"],
  data() {
    return {
      datascore: 0,
      dummyScore: null,
      listDetails: [],
      viewProfileDialog: false,
      MaleData: [],
      FemaleData: [],
      scoreForm: "",
      pageLoading: true,
      pagination: {
        rowsPerPage: 0
      },
      columns: [],
      errorProtein: false,
      errorMessageProtein: "",
      criteriaListsData: [],
      maleDataForm: []
    };
  },
  computed: {
    isDone() {
      return true;
    },
    listofScores() {
      return this.$store.state.score.listofScores;
    },
    listofContestants() {
      return this.$store.state.contestant.listofContestants;
    }
  },
  methods: {
    totalScore(data) {
      let totalScoreValue = 0;
      forEach(data.criteriaLists, function(value) {
        let percent = value.rating + 0;
        let numbervalue = value.score + 0;
        let totalPercent;

        totalPercent = (parseInt(numbervalue) * parseInt(percent)) / 100;

        totalScoreValue += totalPercent;
      });
      return totalScoreValue;
    },
    validate(data) {
      let thisIndex = findIndex(this.criteriaListsData, ["name", data.name]);

      let newValue;
      if (data.score > 100) {
        newValue = {
          score: data.score,
          rating: data.rating,
          name: data.name,
          error: true,
          errorMessage: "The value must not exceed 100"
        };
      } else {
        newValue = {
          score: data.score,
          rating: data.rating,
          name: data.name,
          error: false,
          errorMessage: ""
        };
      }

      vue.set(this.criteriaListsData, thisIndex, newValue);
    },
    viewProfile(data) {
      this.listDetails = data;
      this.viewProfileDialog = true;
    },
    getMaleData() {
      let vm = this;
      forEach(this.listofContestants, function(value, key) {
        let findData = find(vm.listofScores, [
          "yawangaIndex",
          value.male.keyIndex +
            vm.dataCateg.keyIndex +
            vm.tab +
            "Male" +
            vm.$store.state.auth.user.keyIndex
        ]);
        if (!findData) {
          vm.MaleData.push({
            score: "",
            criteriaLists: vm.criteriaListsData,
            ...value.male
          });

          vm.MaleData.forEach((row, index) => {
            row.criteriaLists.forEach((row2, index2) => {
              row2.index = index2;
            });
          });
        } else {
          alert("test");
          vm.MaleData.push(findData.data);
        }
      });

      // forEach(vm.MaleData, function(row, key) {
      //   forEach(vm.criteriaListsData, function(value, key2) {
      //     row.criteriaLists.push({
      //       score: "",
      //       rating: value.rating,
      //       name: value.name,
      //       error: false,
      //       errorMessage: "",
      //       index: key2
      //     });
      //   });
      // });

      vm.MaleData.forEach((row, index) => {
        row.index = index + 1;
      });
    },
    getFemaleData() {
      let vm = this;
      forEach(this.listofContestants, function(value, key) {
        let findData = find(vm.listofScores, [
          "yawangaIndex",
          value.female.keyIndex +
            vm.dataCateg.keyIndex +
            vm.tab +
            "Female" +
            vm.$store.state.auth.user.keyIndex
        ]);

        if (!findData) {
          vm.FemaleData.push({
            score: "",
            ...value.female
          });
        } else {
          vm.FemaleData.push(findData.data);
        }
      });

      vm.FemaleData.forEach((row, index) => {
        row.index = index + 1;
      });
    },
    inputSCORE(data) {
      console.log(data);
      this.dummyScore = data;
    },
    saveScore(payload1, payload2, name) {
      // console.log(this.MaleData);
      // console.log(payload1, payload2);
      let vm = this;

      let myindexCriteria = findIndex(payload2, ["name", name]);
      let myindex = findIndex(this.MaleData, ["index", payload1.index]);
      this.MaleData[myindex] = payload1;

      let newdata = this.MaleData[myindex];
      newdata.criteriaLists[myindexCriteria + 1].score = this.dummyScore;
      vue.set(this.MaleData, myindex, newdata);
      // this.MaleData[myindex].criteriaLists[myindexCriteria + 1] = {
      //   score: vm.dummyScore,
      //   rating: "80",
      //   name: "content",
      //   error: false,
      //   errorMessage: ""
      // };

      console.log(this.MaleData);
      // let vm = this;
      // vm.$store
      //   .dispatch("score/addScoreAction", {
      //     dataCateg: this.dataCateg,
      //     data: data,
      //     tab: this.tab,
      //     userAccount: this.$store.state.auth.user
      //   })
      //   .then(result => {
      //     vm.$q.notify({
      //       message: result + " successfully added a score ",
      //       timeout: 4000,
      //       position: "bottom-left",
      //       icon: "las la-user-tag"
      //     });
      // });
    },
    submitScore() {
      //   let vm = this;
      //   forEach(this.MaleData, function(value) {
      //     vm.$store.dispatch("score/addScoreAction", value).then(result => {
      //       vm.$q.notify({
      //         message: result + " successfully added a score ",
      //         timeout: 4000,
      //         position: "bottom-left",
      //         icon: "las la-user-tag"
      //       });
      //     });
      //   });
    }
  },
  created() {
    const vm = this;

    this.columns = [];
    this.columns = [
      {
        name: "index",
        label: "#",
        field: "index",
        align: "left"
      },
      {
        name: "name",
        label: "Representative",
        align: "left",
        headerClasses: "text-indigo"
      }
    ];

    forEach(this.dataCateg.criteriaList, function(value, key) {
      vm.criteriaListsData.push({
        score: "",
        rating: value.rating,
        name: value.name,
        error: false,
        errorMessage: ""
      });

      vm.columns.push({
        name: value.name,
        label: value.name,
        field: value.name,
        headerClasses: "text-indigo text-capitalize"
      });
    });

    vm.columns.push({
      name: "score",
      label: "Total Score",
      field: "score",
      sortable: true,
      headerClasses: "text-indigo"
    });

    this.$store.dispatch(
      "contestant/getContestantAction",
      this.$store.state.auth.user.eventKeyindex
    );

    this.$store.dispatch("score/getScoreAction").then(result => {
      setTimeout(function() {
        vm.pageLoading = false;
        vm.getMaleData();
        vm.getFemaleData();
      }, 1000);
    });
  }
};
</script>

<style lang="scss" scoped></style>
