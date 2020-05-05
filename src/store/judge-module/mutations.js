import vue from "vue";
export function judgeActionMutation(state, payload) {
  vue.set(state.listofJudges, payload.keyIndex, payload);
}

export function DELETE_judgeActionMutation(state, payload) {
  vue.delete(state.listofJudges, payload.keyIndex);
}
