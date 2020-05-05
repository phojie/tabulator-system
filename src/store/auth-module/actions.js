import { fireDB, firebaseAuth } from "boot/firebase";

export function checKey(context, payload) {
  // console.log(payload);
  return new Promise((resolve, reject) => {
    const docRef = fireDB.collection("Owner/CKCM/Judges");
  });
}

export function getSettings(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB.collection("settings");
    docRef.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          context.commit("settingsActionMutation", change.doc.data());
        }
        if (change.type === "modified") {
          context.commit("settingsActionMutation", change.doc.data());
        }
        if (change.type === "removed") {
        }
      });
    });
  });
}

export async function signIn({ commit }, payload) {
  const email = payload.email;
  const password = payload.password;

  await firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then(function(user) {
      commit("SET_USER", user);
    })
    .catch(function(error) {
      throw error;
    });
}

export async function signOut({ commit }) {
  const vm = this;
  await firebaseAuth.signOut().then(() => {
    commit("SET_USER", {});
    vm.$router.replace({ name: "login" });
  });
}
