import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: 'AIzaSyCTunhepxOuJE0aJPNWRhtbxCmCPIj29rI',
    authDomain: 'tedx-148a6.firebaseapp.com',
    databaseURL: 'https://tedx-148a6.firebaseio.com',
    projectId: 'tedx-148a6',
    storageBucket: 'tedx-148a6.appspot.com',
    messagingSenderId: '199524458684',
};

const app = firebase.initializeApp(config);
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true });
firebase.firestore().enablePersistence({ experimentalTabSynchronization:true });

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export default app;
