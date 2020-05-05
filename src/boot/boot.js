import { firebaseAuth, firebase } from "./firebase";

export default ({ app, router, Vue, store }) => {
  firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });

  firebase.firestore().enablePersistence();

  // Register the Firebase authentication listener
  // firebaseAuth
  //   .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  //   .then(function() {
  //     // Existing and future Auth states are now persisted in the current
  //     // session only. Closing the window would clear any existing state even
  //     // if a user forgets to sign out.
  //     // ...
  //     // New sign-in will be persisted with session persistence.
  //     // return this.$firebase.auth().signInWithEmailAndPassword(email, password)
  //     // alert('relogin')
  //   })
  //   .catch(function(error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log(errorCode, errorMessage);
  //   });

  router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(route => route.meta.authRequired);
    const loginBa = to.matched.some(route => route.meta.loginRequired);
    firebaseAuth.onAuthStateChanged(user => {
      if (authRequired) {
        if (user) {
          store
            .dispatch("auth/CHECK_DATA", user)
            .then(function() {
              next();
            })
            .catch(function() {
              store.dispatch("auth/signOut");
              next({
                name: "login"
              });
            });
          // User is already signed in. Continue on.
          // next();
        } else {
          // Not signed in. Redirect to login page.
          store.commit("auth/RESET_USER");
          next({
            name: "login"
          });
        }
      } else if (!authRequired && loginBa && user) {
        store.commit("auth/SET_USER", user);
        next({
          name: "dashboard"
        });
      } else {
        console.log("No user");
        next();
      }
    });
  });
};
