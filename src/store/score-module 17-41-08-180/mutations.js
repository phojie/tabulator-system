import vue from "vue";

export function scoreActionMutation(state, payload) {
  vue.set(state.listofScores, payload.keyIndex, payload);
}
