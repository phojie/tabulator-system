import vue from "vue";

export function eventActionMutation(state, payload) {
  vue.set(state.listOfEVENTS, payload.keyIndex, payload);
}

export function eventActionMutationUpdate(state, payload) {
  vue.set(state.listOfEVENTS, payload.keyIndex, payload);
}

export function eventActionMutationDelete(state, payload) {
  vue.delete(state.listOfEVENTS, payload.keyIndex);
}

export function SET_EVENTCHOOSED(state, payload) {
  state.eventsLinkDataId = payload;
}
