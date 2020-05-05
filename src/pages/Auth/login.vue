<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="flex flex-center bg-white">
        <div class="fit row wrap justify-center items-center content-center">
          <q-card flat class="q-pa-md col-md-4 col-sm-9 col-xs-12">
            <q-card-section>
              <div class="text-center q-mb-xs">
                <q-avatar size="140px">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/tabulationsystem-e18b9.appspot.com/o/ckcmLogo%2Fapple-touch-icon-180x180.png?alt=media&token=0a3c951b-25e3-4336-a440-4a947fad8f0e"
                    alt
                  />
                </q-avatar>
              </div>
              <q-toolbar class="text-center q-px-none q-mb-md text-primary">
                <q-toolbar-title class="text-black">
                  <div class="text-weight-bolder text-primary" style="font-size:32px">CKCM TABULATOR</div>
                  <div
                    style="margin-top:-10px"
                    class="text-subtitle1 text-weight-medium text-blue-grey-7"
                  >© Christ the King College de Maranding</div>
                </q-toolbar-title>
              </q-toolbar>
              <div class="text-h6 text-bold q-mb-sm text-blue-grey-9">Log in Account</div>
              <q-form autofocus @submit="submitLogin" @reset="resetLogin">
                <div class="column q-gutter-y-md">
                  <q-input
                    ref="passwordRef"
                    outlined
                    input-class="text-weight-medium"
                    type="password"
                    label="Security Key"
                    v-model="password"
                  >
                    <template v-slot:prepend>
                      <q-icon name="las la-key" />
                    </template>
                  </q-input>
                  <q-btn
                    class="shadow-4 q-mt-lg"
                    glossy
                    :loading="loading"
                    size="lg"
                    no-caps
                    color="primary"
                    type="submit"
                  >Sign In</q-btn>
                  <div
                    class="text-center text-weight-bolder text-blue-grey-8"
                  >ALLRIGHTS RESERVED - 2020</div>
                </div>
              </q-form>
              <q-inner-loading :showing="loading">
                <q-spinner-ios size="60px" color="primary" />
              </q-inner-loading>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async submitLogin() {
      const vm = this;
      this.loading = true;
      this.errorMessage = "";
      await this.$store
        .dispatch("auth/checKey", this.password)
        .then(user => {
          vm.signIn(user);
        })
        .catch(error => {
          vm.loading = false;
          vm.password = "";
          vm.$refs.passwordRef.focus();
          vm.$q.notify({
            type: "negative",
            message: error
          });
        });
    },
    async signIn(user) {
      const vm = this;
      this.loading = true;
      this.errorMessage = "";
      await this.$store
        .dispatch("auth/signIn", user)
        .then(user => {
          vm.$q.notify({
            icon: "las la-thumbs-up",
            progress: true,
            position: "bottom-right",
            message: "Successfully Login",
            color: "primary",
            textColor: "white",
            classes: "glossy"
          });
          setTimeout(() => {
            vm.loading = false;
            // vm.$router.push({ name: "dashboard" });
          }, 1000);
        })
        .catch(error => {
          vm.loading = false;
          vm.password = "";
          vm.$refs.passwordRef.focus();
          vm.$q.notify({
            type: "negative",
            message: error
          });
        });
    },
    resetLogin() {}
  }
};
</script>

<style lang="scss" scoped></style>
