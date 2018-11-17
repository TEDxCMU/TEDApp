import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyCTunhepxOuJE0aJPNWRhtbxCmCPIj29rI",
  authDomain: "tedx-148a6.firebaseapp.com",
  databaseURL: "https://tedx-148a6.firebaseio.com",
  projectId: "tedx-148a6",
  storageBucket: "tedx-148a6.appspot.com",
  messagingSenderId: "199524458684"
};
const fire = firebase.initializeApp(config);
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export default fire;