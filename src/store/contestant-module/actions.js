import { fireDB, fireStorage } from "boot/firebase";
import concat from "lodash/concat";
export function addContestantAction(context, data) {
  const payload = data.data;
  const repreRef = fireDB.collection("Owner/CKCM/Representative/").doc();
  const repreRefID = repreRef.id;
  var defaultUrl = "/statics/defaultProfile.png";
  const representativeName = new Promise((resolve, reject) => {
    repreRef.set({
      keyIndex: repreRefID,
      eventKeyindex: data.eventId,
      name: payload.candidatesRepresent
    });
    resolve().catch(error => {
      reject(error);
    });
  });

  //female area created
  const contestantsName = new Promise((resolve, reject) => {
    const contestantRef = fireDB.collection("Owner/CKCM/Contestants/").doc();
    const contestantID = contestantRef.id;
    if (payload.female.profileimg.__img["src"] !== "") {
      var uploadTask = fireStorage
        .ref()
        .child("contestantImg/" + contestantID)
        .put(payload.female.profileimg);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit("commitLoading", false);
          } else {
            context.commit("commitLoading", true);
          }

          resolve();
        },
        function(error) {
          // Handle unsuccessful uploads
          console.log(error);
          reject();
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              contestantRef.set({
                keyIndex: contestantID,
                representKeyIndex: repreRefID,
                eventKeyindex: data.eventId,
                gender: "Female",
                fullname: payload.female.fullname,
                yearlevel: payload.female.yearlevel,
                age: payload.female.age,
                profileimg: downloadURL,
                quotes: payload.female.quotes
              });
              resolve(payload);
            })
            .catch(error => {
              reject(error);
            });
        }
      );
    } else {
      contestantRef.set({
        keyIndex: contestantID,
        representKeyIndex: repreRefID,
        eventKeyindex: data.eventId,
        gender: "Female",
        fullname: payload.female.fullname,
        yearlevel: payload.female.yearlevel,
        age: payload.female.age,
        profileimg: defaultUrl,
        quotes: payload.female.quotes
      });

      resolve();
    }
  });

  //male area created
  const contestantsName2 = new Promise((resolve, reject) => {
    const contestantRef = fireDB.collection("Owner/CKCM/Contestants/").doc();
    const contestantID = contestantRef.id;

    if (payload.male.profileimg.__img["src"] !== "") {
      var uploadTask = fireStorage
        .ref()
        .child("contestantImg/" + contestantID)
        .put(payload.male.profileimg);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit("commitLoading", false);
          } else {
            context.commit("commitLoading", true);
          }

          resolve();
        },
        function(error) {
          // Handle unsuccessful uploads
          console.log(error);
          reject();
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              contestantRef.set({
                keyIndex: contestantID,
                representKeyIndex: repreRefID,
                eventKeyindex: data.eventId,
                gender: "Male",
                fullname: payload.male.fullname,
                yearlevel: payload.male.yearlevel,
                age: payload.male.age,
                profileimg: downloadURL,
                quotes: payload.male.quotes
              });
              resolve(payload);
            })

            .catch(error => {
              reject(error);
            });
        }
      );
    } else {
      contestantRef.set({
        keyIndex: contestantID,
        representKeyIndex: repreRefID,
        eventKeyindex: data.eventId,
        gender: "Male",
        fullname: payload.male.fullname,
        yearlevel: payload.male.yearlevel,
        age: payload.male.age,
        profileimg: defaultUrl,
        quotes: payload.male.quotes
      });

      resolve();
    }
  });
  return Promise.all([
    representativeName,
    contestantsName,
    contestantsName2
  ]).then(function(payload) {
    return data.data.candidatesRepresent;
  });
}

export function getContestantAction(context, payload) {
  return new Promise((resolve, reject) => {
    const docRef = fireDB
      .collection("Owner/CKCM/Representative")
      .where("eventKeyindex", "==", payload);
    docRef.onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          const data = fireDB
            .collection("Owner/CKCM/Contestants")
            .where("representKeyIndex", "==", change.doc.data().keyIndex);
          data.onSnapshot(function(contSnap) {
            contSnap.docChanges().forEach(function(contChange) {
              if (contChange.type === "added") {
                let name = change.doc.data().name;
                let representKeyIndex = change.doc.data().keyIndex;
                context.commit("contestantActionMutation", {
                  name,
                  representKeyIndex,
                  ...contChange.doc.data()
                });
              } else if (contChange.type === "modified") {
                let name = change.doc.data().name;
                let representKeyIndex = change.doc.data().keyIndex;
                context.commit("UPDATE_contestantActionMutation", {
                  name,
                  representKeyIndex,
                  ...contChange.doc.data()
                });
              } else if (contChange.type === "removed") {
                context.commit(
                  "DELETE_contestantActionMutation",
                  change.doc.data().keyIndex
                );
              }
            });
          });
        } else if (change.type === "modified") {
          context.commit("UPDATE_representativename", change.doc.data());
          // console.log("Modified city: ", change.doc.data());
        } else if (change.type === "removed") {
          context.commit("DELETE_contestantActionMutation", change.doc.data());
        }
      });

      resolve(snapshot.empty);
    });
  });
}

export function updateContestantAction(context, data) {
  const payload = data.data;
  const repreRef = fireDB
    .collection("Owner/CKCM/Representative/")
    .doc(payload.representKeyIndex);
  var defaultUrl = "/statics/defaultProfile.png";
  const representativeName = new Promise((resolve, reject) => {
    repreRef.update({
      keyIndex: payload.representKeyIndex,
      eventKeyindex: data.eventId,
      name: payload.candidatesRepresent
    });
    resolve().catch(error => {
      reject(error);
    });
  });

  //female area created
  const contestantsName = new Promise((resolve, reject) => {
    const contestantRef = fireDB
      .collection("Owner/CKCM/Contestants/")
      .doc(payload.female.keyIndex);

    //if pic not change
    if (
      payload.female.profileimg.__img["src"] !== payload.female.dummyprofileimg
    ) {
      var uploadTask = fireStorage
        .ref()
        .child("contestantImg/" + payload.female.keyIndex)
        .put(payload.female.profileimg);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit("commitLoading", false);
          } else {
            context.commit("commitLoading", true);
          }

          resolve();
        },
        function(error) {
          // Handle unsuccessful uploads
          console.log(error);
          reject();
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              contestantRef.update({
                keyIndex: payload.female.keyIndex,
                representKeyIndex: payload.representKeyIndex,
                eventKeyindex: data.eventId,
                gender: "Female",
                fullname: payload.female.fullname,
                yearlevel: payload.female.yearlevel,
                age: payload.female.age,
                profileimg: downloadURL,
                quotes: payload.female.quotes
              });
              resolve(payload);
            })
            .catch(error => {
              reject(error);
            });
        }
      );
    } else {
      contestantRef.update({
        keyIndex: payload.female.keyIndex,
        representKeyIndex: payload.representKeyIndex,
        eventKeyindex: data.eventId,
        gender: "Female",
        fullname: payload.female.fullname,
        yearlevel: payload.female.yearlevel,
        age: payload.female.age,
        profileimg: payload.female.profileimg.__img["src"],
        quotes: payload.female.quotes
      });

      resolve();
    }
  });

  const contestantsName2 = new Promise((resolve, reject) => {
    const contestantRef = fireDB
      .collection("Owner/CKCM/Contestants/")
      .doc(payload.male.keyIndex);

    if (payload.male.profileimg.__img["src"] !== payload.male.dummyprofileimg) {
      var uploadTask = fireStorage
        .ref()
        .child("contestantImg/" + payload.male.keyIndex)
        .put(payload.male.profileimg);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit("commitLoading", false);
          } else {
            context.commit("commitLoading", true);
          }

          resolve();
        },
        function(error) {
          // Handle unsuccessful uploads
          console.log(error);
          reject();
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              contestantRef.update({
                keyIndex: payload.male.keyIndex,
                representKeyIndex: payload.representKeyIndex,
                eventKeyindex: data.eventId,
                gender: "Male",
                fullname: payload.male.fullname,
                yearlevel: payload.male.yearlevel,
                age: payload.male.age,
                profileimg: downloadURL,
                quotes: payload.male.quotes
              });
              resolve(payload);
            })

            .catch(error => {
              reject(error);
            });
        }
      );
    } else {
      contestantRef.update({
        keyIndex: payload.male.keyIndex,
        representKeyIndex: payload.representKeyIndex,
        eventKeyindex: data.eventId,
        gender: "Male",
        fullname: payload.male.fullname,
        yearlevel: payload.male.yearlevel,
        age: payload.male.age,
        profileimg: payload.male.profileimg.__img["src"],
        quotes: payload.male.quotes
      });

      resolve();
    }
  });
  return Promise.all([representativeName, contestantsName, contestantsName2])
    .then(function(payload) {
      return data.data.candidatesRepresent;
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function deleteContestantAction(context, payload) {
  return new Promise(function(resolve, reject) {
    const repreRef = fireDB
      .collection("Owner/CKCM/Representative/")
      .doc(payload.representKeyIndex);
    repreRef
      .delete()
      .then(() => {
        resolve(payload.candidatesRepresent);
      })
      .catch(error => {
        reject(error);
      });

    //Delete MALE_contestant
    const contestantRefMale = fireDB
      .collection("Owner/CKCM/Contestants/")
      .doc(payload.male.keyIndex);
    contestantRefMale
      .delete()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });

    // Delete MALE_PICTURE
    const deleteMalePic = fireStorage
      .ref()
      .child("contestantImg/" + payload.male.keyIndex);
    deleteMalePic
      .delete()
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject(error);
      });

    //Delete FEMALE_contestant
    const contestantRefFemale = fireDB
      .collection("Owner/CKCM/Contestants/")
      .doc(payload.female.keyIndex);
    contestantRefFemale
      .delete()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });

    // Delete FEMALE_PIC
    const deleteFemlePic = fireStorage
      .ref()
      .child("contestantImg/" + payload.female.keyIndex);
    deleteFemlePic
      .delete()
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
