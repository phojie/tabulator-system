import vue from "vue";

export function categoryActionMutation(state, payload) {
  vue.set(state.listofCategories, payload.keyIndex, payload);
}

export function DELETE_categoryActionMutation(state, payload) {
  vue.delete(state.listofCategories, payload.keyIndex);
}
