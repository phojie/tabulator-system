<template>
  <q-layout view="hHr lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="q-ml-md-lg q-ml-xs-none">
          <q-chip
            square
            color="white"
            text-color="primary"
            class="text-weight-bold text-capitalize"
            style="letter-spacing:1px"
            icon="event_note"
          >{{ eventChoose.eventTitle }}</q-chip>
        </q-toolbar-title>
        <div @click="signOut" class="cursor-pointer text-weight-bolder text-h5">
          <span>
            <q-avatar size="32px">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/tabulationsystem-e18b9.appspot.com/o/ckcmLogo%2Fapple-touch-icon-180x180.png?alt=media&token=0a3c951b-25e3-4336-a440-4a947fad8f0e"
              />
            </q-avatar>
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import filter from "lodash/filter";
import find from "lodash/find";
export default {
  computed: {
    ...mapState("auth", ["user"]),
    listOfEVENTS() {
      const data = filter(this.$store.state.event.listOfEVENTS, "keyIndex");
      return data;
    },
    eventChoose() {
      if (this.user != null) {
        const myData = find(this.listOfEVENTS, [
          "keyIndex",
          this.user.eventKeyindex
        ]);

        if (myData) {
          return myData;
        } else {
          return "";
        }
      } else {
        return "";
      }
    }
  },
  methods: {
    dateConvert(schedule) {
      const newDate = date.formatDate(schedule, "MMMM DD, YYYY");
      return newDate;
    },
    signOut() {
      this.$store.dispatch("auth/signOut");
    },
    async getEvent() {
      const vm = this;
      this.$q.loadingBar.start();
      this.$q.loading.show();
      await this.$store
        .dispatch("event/getEventAction")
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
    this.getEvent();
  }
};
</script>
