import { fireDB } from "boot/firebase";
import lowercase from "lodash/lowerCase";
import capitalize from "lodash/capitalize";

export function addScoreAction(context, payload) {
  return new Promise(function(resolve, reject) {
    const scoreRef = fireDB
      .collection("Owner/CKCM/Scores/")
      .doc(payload.keyIndex);
    scoreRef.set(payload);

    resolve(capitalize(payload.fullname)).catch(function(error) {
      resolve(error);
    });
  });
}

export function getScoreAction(context, payload) {
  return new Promise(function(resolve, reject) {
    const scoreRef = fireDB
      .collection("Owner/CKCM/Scores")
      .where("eventKeyindex", "==", payload);
    scoreRef.onSnapshot(
      function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type == "added" || change.type == "modified") {
            context.commit("scoreActionMutation", change.doc.data());
          }
          if (change.type == "removed") {
            // context.commit("DELETE_scoreActionMutation", change.doc.data());
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
