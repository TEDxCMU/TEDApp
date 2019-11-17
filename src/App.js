import React, { Component } from 'react';
import './App.css';
import { auth } from './fire';
import { Schedule } from './components/schedule/schedule.js';
import { EventDetails } from './components/event/eventDetails.js';
import { Navigation } from './components/navigation/navigation.js';
import { Login } from './components/login/login.js';
import { MyQuestions } from './components/questions/myQuestions.js';
import { PopUp } from './components/addToHome/addToHome.js';
import { BrainFood } from './components/brains/brainFood.js';
import { Map } from './components/map/map.js';
import { Router, Route, Switch} from 'react-router-dom'
import fire from './fire.js';
import Faq from './components/faq/faq';
import { isAndroid, isIOS } from "react-device-detect";
import Fingerprint from "fingerprintjs2";
import error404 from './404.png';

import Popup from 'react-popup';
import moment from 'moment';
import Header from './components/header/header';
import QANDA from './components/brains/subComponents/qAndA';
import Draw from './components/draw/draw';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: [],
      iosPopUp: false,
      chromePopUp: false,
      loaded: false
    }
  }

  render() {
    if (this.state.db === undefined && this.state.noActiveEvents === undefined) {
      return <div></div>
    }
    else if (this.state.db === undefined && this.state.noActiveEvents === true) {
      return <div>
        <Router history={this.props.history}>
          <Header
            title="Sorry!"
            description="There are currently no events scheduled in the system. Please check back later." 
            db={this.state.db}/>
        </Router>
      </div>
    }
    else if (this.state.db !== undefined) {  
      return (
        <div>
          <Router history={this.props.history}>
            <div className="App">
            <Navigation loaded={true} user={this.state.user} isAdmin={this.state.isAdmin} burgerColor={this.state.burgerColor} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
            <Switch>
            <Route path="/" exact strict render={this.schedulePage}/>
            <Route path="/talks/:id" exact strict component={EventDetails}/>
            <Route path="/faq" exact strict render={this.faqPage}/>
            <Route path="/login" exact strict render={this.loginPage}/>
            <Route path="/ripple" exact strict render={this.RipplePage}/>
            <Route path="/qanda" exact strict render={this.QANDAPage}/>
            <Route path="/map" exact strict render={this.mapPage}/>
            <Route path="/draw" exact strict render={this.drawPage}/>
            {this.state.user !== null && this.state.isAdmin !== true ?
              <Route path="/questions" exact strict render={this.questionsPage}/>
            :
              <div></div>
            }
            {/* <Route path="/questions" exact strict render={this.questionsPage}/> */}
            <Route component={this.noMatch} />
            </Switch>
              <div style={{display: 'flex', flexDirection: "column", alignItems:"flex-end", justifyContent: 'flex-end', width: '100%'}}> 
                {this.state.iosPopUp === true && JSON.parse(localStorage.getItem("popup")) === null && localStorage.getItem("fingerprint") !== null ?
                <PopUp iOS={true} loaded={this.state.loaded}/>
                :
                <div align="center"></div>
                }
              </div>
            </div>
          </Router>
          <Popup closeBtn={true} />
        </div>
      );
    }
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  isLoaded = () => {
    this.setState({
      loaded: true
    })
  }

  // renders if the path is not explicitly declared (404 error)
  noMatch = () => {
    let error = "Oh dear, this page is not available. Just use the menu on the right to navigate to safety! If you think this is a mistake, please don't call the police, we'll just fire our web developers."
    return (
    <div>
      <Header
        title="404: Not Found"
        description=  {error}  
        db={this.state.db} />
      <img src={error404} alt="404 Error: Page Not Found" style={{ width: '40vh', height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto'}}></img>
    </div>
    
    )
  }

  navigationPage = (user) => {
    return(
      <div>
        <Navigation
          user={user} 
          login={this.login} 
          logout={this.logout} 
          isiPhone={this.state.iosPopUp} 
          isAndroid={this.state.chromePopUp}
          db={this.state.db}
          isAdmin={this.state.isAdmin} />
      </div>
    )
  }

  schedulePage = (props) => {
    return (
      <div> 
          {/* now the main app div will be 100% of the total screen real estate, which means the popup appears at the bottom */}
          <div style= {{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Schedule
              user={this.state.user}
              isLoaded={this.isLoaded}
              scroll={window.scrollY}
              db={this.state.db} 
              isAdmin={this.state.isAdmin}
              eventDate={this.state.eventDate}/> 
          </div>
      </div>

    );
  }

  questionsPage = (props) => {
    return (
      <div>
        <Header
          title="My Questions"
          description="See what the audience is saying, and give them your two cents!" 
          isAdmin={this.state.isAdmin}
          db={this.state.db} />
        <MyQuestions
        user={this.state.user}
        isLoaded={this.isLoaded}
        isAdmin={this.state.isAdmin} 
        db={this.state.db} /> 
      </div>
    );
  }

  mapPage = (props) => {
    console.log("hello")
    return (
      <div>
        <Header
          title="Map"
          description="Navigate your way to the main event." 
          isAdmin={this.state.isAdmin}
          db={this.state.db} />
        <Map
        user={this.state.user}
        isLoaded={this.isLoaded}
        isAdmin={this.state.isAdmin} 
        db={this.state.db} /> 
      </div>
    );
  }

  EventPage = (props) => {
    return (
      <div>
        <Header
          title="Event"
          db={this.state.db}
          isAdmin={this.state.isAdmin} />
        <EventDetails
        user={this.state.user}
        isLoaded={this.isLoaded}
        isAdmin={this.state.isAdmin} 
        db={this.state.db} />
      </div>
    );
  }

  faqPage = (props) => {
    return (
      <div>
        <Header
          title="FAQ"
          description="Find answers to your questions on food, parking, or anything in-between." 
          db={this.state.db}
          isAdmin={this.state.isAdmin} />
        <Faq
          user={this.state.user}
          isLoaded={this.isLoaded} 
          isAdmin={this.state.isAdmin}
          db={this.state.db} /> 
      </div>
    );
  }
  
  RipplePage = (props) => {
    return (
      <div>
        <Header
          title="Ripple"
          description="See the reach of this conference and expand the Ripple Effect." 
          db={this.state.db}
          isAdmin={this.state.isAdmin} />
        <BrainFood
        user={this.state.user}
        isLoaded={this.isLoaded}
        db={this.state.db}
        isAdmin={this.state.isAdmin} />
      </div>
    );
  }

  drawPage = () => {
    return (
      <div>
        <Header
          title="Pixel Pen"
          description="Get creative. Draw live and see it in real time."
          db={this.state.db} 
          isAdmin={this.state.isAdmin} />
        <Draw
        user={this.state.user}
        isLoaded={this.isLoaded}
        db={this.state.db}
        isAdmin={this.state.isAdmin} />
      </div>
    );
  }

  QANDAPage = () => {
    return (
      <div>
        <Header
          title="Q&amp;A"
          description="Ask questions and get personalized replies. Answered questions appear here, so check back to see if a speaker replies to you!"
          db={this.state.db} 
          isAdmin={this.state.isAdmin} />
        <QANDA
        user={this.state.user}
        isLoaded={this.isLoaded}
        db={this.state.db}
        isAdmin={this.state.isAdmin} />
      </div>
    );
  }

  loginPage = (props) => {
    return (
      <div>
        <Header
          title="Login"
          description="" 
          isAdmin={this.state.isAdmin}
          db={this.state.db} />
        <Login
        user={this.state.user}
        login={this.login}
        isLoaded={this.isLoaded} 
        isAdmin={this.state.isAdmin}
        db={this.state.db} />
      </div>
    );
  }

  // runs before component renders
  // checks the firestore db to figure out which, if any, conferences are active
  componentDidMount = () => {
    let db = fire.firestore()
    let inactiveCount = 0;
    let activeCount = 0;
    let possibleDBs = [];
    db.collection('active').get().then( snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().active) {
          // push possible DB references to the array
          possibleDBs.push(doc.id)
          activeCount++
        }
        else if (doc.data().active === false) {
          inactiveCount++
        }
        // if all of the databases are inactive, send an error message
        if (snapshot.size === inactiveCount) {
          this.setState({
            noActiveEvents: true
          })
        }
        if ((activeCount + inactiveCount) === snapshot.size && activeCount > 0) {
          // since there are multiple active databases, choose the first one
          this.setState({
            db: possibleDBs[0]
          }, () => this.getEventDate())
        }
      })
    })
  }

  // checks the database for the corresponding event's timestamp to see when the date of the event is
  getEventDate = () => {
    let db = fire.firestore();
    db.collection(this.state.db).doc('eventDate').get().then(doc => {
      if (doc.exists) {
        var formattedDate = moment.unix(doc.data().date.seconds).format("YYYY-MM-DD");
        this.setState({
          eventDate: formattedDate
        }, () => this.assignFingerprint())
      }
    })
  }

  // checks if the web app is being run in a browser, or as an installed app. 
  // if the web app is installed, don't show a pop-up inviting users to install it!
  isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  // does a few things:
  // 1. starts a listener on user authentication that will listen for changes to user states
  // 2. determines what type of device this is and if an install-to-device pop-up should be launched
  // 3. determines if the unique fingerprint of this device exists, and if it does, is it in the database
  // 4. if the device has a unique ID and is not in the database, calls a function to add it to the database
  assignFingerprint = () => {
    let db = fire.firestore();
    this.authListener();
    let type = "";
    if (isAndroid) {
      type = "Android"
      this.setState({
        chromePopUp: isAndroid,
      })
    }
    else if (isIOS && !this.isInStandaloneMode()) {
      type = "iPhone"
      this.setState({
        iosPopUp: isIOS,
      })
    }
    else if ((!isAndroid) && (!isIOS)) {
      type = "Computer"
    }
    const fpInstance = new Fingerprint();
    let that = this;
		fpInstance.get((id)=> {
        localStorage.setItem('fingerprint', id)
        if (localStorage.getItem('fingerprint') === null) {
          /** No fingerprint found, so return without pushing to DB*/
          return
        }        
        db.collection(this.state.db).doc('audience').collection('audience').doc(localStorage.getItem('fingerprint'))
        .get()
        .then((doc) => {
          if (doc.exists) {
            /** Doc exists, so this unique device has visited the page before */
            return
          }
          else {
            that.sendFingerprintToFirestore(type, id)
          }
        })
    });
  }

  // only run if this is the first time the unique device has accessed the web-app
  // adds the device type, ID, and time accessed to the 'audience' collection of the active event
  sendFingerprintToFirestore = (type, id) => {
    let timeAccessed = moment().format('MMMM Do YYYY, h:mm:ss a');
    let db = fire.firestore()
    db.collection(this.state.db).doc('audience').collection('audience').doc(id.toString()).set({
      id, type, timeAccessed
    }, () => this.setState({
      fingerprint: id
    }))
  }


  // self explanatory ;)
  logout = () => {
    auth.signOut()
      .then(() => {
        window.location.reload();
      });
  }

  // any time the user logs in or logs out, update the state and local storage to reflect the change
  // also calls a function to authenticate admins, if necessary
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => this.getAdmins());
        localStorage.setItem('user', user);
        localStorage.setItem('userEmail', user.email);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
      }
    });
  }

  // gets ID of all allowed admins and check if the current user is an admin
  getAdmins = () => {
    let db = fire.firestore();
    db.collection('admins').get().then(snapshot => {
      snapshot.forEach(docSnapshot => {
        if (docSnapshot.id === this.state.user.email) {
          this.setState({
            isAdmin: true
          })
        }
      })
    })
  }

}

export default App;