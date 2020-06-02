import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyCTunhepxOuJE0aJPNWRhtbxCmCPIj29rI',
    authDomain: 'tedx-148a6.firebaseapp.com',
    databaseURL: 'https://tedx-148a6.firebaseio.com',
    projectId: 'tedx-148a6',
    storageBucket: 'tedx-148a6.appspot.com',
    messagingSenderId: '199524458684',
};

const reactReduxFirebaseConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
};

firebase.initializeApp(firebaseConfig);

const rootReducer = combineReducers({ firebase: firebaseReducer });

const initialState = {};
const store = createStore(rootReducer, initialState);

const reactReduxFirebaseProps = {
    firebase,
    config: reactReduxFirebaseConfig,
    dispatch: store.dispatch,
};

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
                <Component {...pageProps} />
            </ReactReduxFirebaseProvider>
        </Provider>
    );
}

export default MyApp;
