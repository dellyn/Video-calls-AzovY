import firebase from "firebase";
import { getRoomId } from "../App";

var firebaseConfig = {
  apiKey: "AIzaSyBVy1Cw3wJF0wgF4gmEjewGAhSLJj24LmA",
  authDomain: "azovyy.firebaseapp.com",
  databaseURL: "https://azovyy-default-rtdb.firebaseio.com",
  projectId: "azovyy",
  storageBucket: "azovyy.appspot.com",
  messagingSenderId: "827761361201",
  appId: "1:827761361201:web:466a4338444e31f56a7010",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

const firepadRef = firebase.database().ref();
export function getTimestamp() {
  return firebase.firestore.Timestamp.now().toDate().toString();
}
export default firepadRef.child(getRoomId());
