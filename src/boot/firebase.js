import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
import Vue from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyC3j1-oWR3-2ykA7PppNPYZxWfLG5cHCgM",
  authDomain: "tabulationsystem-e18b9.firebaseapp.com",
  databaseURL: "https://tabulationsystem-e18b9.firebaseio.com",
  projectId: "tabulationsystem-e18b9",
  storageBucket: "tabulationsystem-e18b9.appspot.com",
  messagingSenderId: "153955355600",
  appId: "1:153955355600:web:6b2016fa2cf535ac1c07d5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

Vue.prototype.$firebase = firebase;

const firebaseAuth = firebaseApp.auth();
const fireDB = firebaseApp.firestore();
const rdb = firebaseApp.database();
const fireStorage = firebaseApp.storage();

// export default ({ Vue }) => {
//   // Initialize Firebase from settings
//   firebase.initializeApp(firebaseConfig)
//   Vue.prototype.$firebase = firebase
// }
export { fireDB, rdb, fireStorage, firebaseAuth, firebase };
