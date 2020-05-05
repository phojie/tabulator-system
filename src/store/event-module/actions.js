import { fireDB } from "boot/firebase";

export function addEventAction(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB.collection("Owner/CKCM/Events/").doc();
    const docRefID = docRef.id;
    docRef.set({
      keyIndex: docRefID,
      eventTitle: payload.title,
      schedule: payload.schedule
    });
    resolve(payload).catch(function(error) {
      reject(error);
      console.error("Error writing document: ", error);
    });
  });
}

export function getEventAction(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB.collection("Owner/CKCM/Events/");
    docRef.onSnapshot(
      function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {
            context.commit("eventActionMutation", change.doc.data());
          }
          if (change.type === "modified") {
            context.commit("eventActionMutationUpdate", change.doc.data());
          }
          if (change.type === "removed") {
            context.commit("eventActionMutationDelete", change.doc.data());
          }
        });
        resolve();
      },
      function(error) {
        resolve(error);
      }
    );
  });
}

export function updateEventAction(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB.collection("Owner/CKCM/Events").doc(payload.keyIndex);
    docRef.update({
      keyIndex: payload.keyIndex,
      eventTitle: payload.eventTitle,
      schedule: payload.schedule
    });
    resolve(payload).catch(function(error) {
      reject(error);
      console.error("Error writing document: ", error);
    });
  });
}

export function deleteEventAction(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB
      .collection("Owner/CKCM/Events/")
      .doc(payload.keyIndex);
    docRef.delete();
    resolve(payload)
      // .then(() => {
      // })
      .catch(error => {
        reject(error);
      });
  });

  //representative
  //contestant
}
