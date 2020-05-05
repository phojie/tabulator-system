import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth-module";
import event from "./event-module";
import contestant from "./contestant-module";
import judge from "./judge-module";
import category from "./category-module";
import score from "./score-module";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      event,
      contestant,
      judge,
      category,
      score
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  // if (process.env.DEV && module.hot) {
  //   module.hot.accept(['./auth-module'], () => {
  //     const newAuth = require('./auth-module').default
  //     Store.hotUpdate({ modules: { auth: newAuth } })
  //   })
  // }

  return Store;
}
