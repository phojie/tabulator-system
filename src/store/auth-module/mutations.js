export function SET_USER(state, payload) {
  state.user = {
    uid: payload.uid,
    email: payload.email,
    metaData: payload.metadata
  };
  // const user = payload
  // state.user = user
}

export function RESET_USER(state, payload) {
  state.user = {};
}

export function loading(state, payload) {
  state.loading = payload;
}

export function settingsActionMutation(state, payload) {
  state.settings = payload.doneAlready;
}
