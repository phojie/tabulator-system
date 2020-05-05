import vue from "vue";
import find from "lodash/find";
export function contestantActionMutation(state, payload) {
  // vue.set(state.listofContestants, payload.keyIndex, payload);
  let myData = state.listofContestants[payload.representKeyIndex];
  if (payload.gender === "Male") {
    vue.set(state.listofContestants, payload.representKeyIndex, {
      name: payload.name,
      representKeyIndex: payload.representKeyIndex,
      male: payload,
      ...myData
    });
  } else {
    vue.set(state.listofContestants, payload.representKeyIndex, {
      name: payload.name,
      representKeyIndex: payload.representKeyIndex,
      female: payload,
      ...myData
    });
  }
}

export function UPDATE_contestantActionMutation(state, payload) {
  // vue.set(state.listofContestants, payload.keyIndex, payload);
  if (payload.gender === "Male") {
    state.listofContestants[payload.representKeyIndex].male = payload;
  } else if (payload.gender === "Female") {
    state.listofContestants[payload.representKeyIndex].female = payload;
  }
}

export function UPDATE_representativename(state, payload) {
  let thischange = find(state.listofContestants, "name", payload.name);
  state.listofContestants[thischange.representKeyIndex].name = payload.name;
}

export function DELETE_contestantActionMutation(state, payload) {
  vue.delete(state.listofContestants, payload.keyIndex);
}

export function commitLoading(state, payload) {
  state.loading = payload;
}

export function RESET_listofContestants(state) {
  state.listofContestants = {};
}
