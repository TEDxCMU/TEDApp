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
    else {    
      return (
        <div>
          <Router history={this.props.history}>
            <div className="App">
            <Navigation loaded={true} user={this.state.user} burgerColor={this.state.burgerColor} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
            <Switch>
            <Route path="/" exact strict render={this.schedulePage}/>
            <Route path="/talks/:id" exact strict component={EventDetails}/>
            <Route path="/faq" exact strict render={this.faqPage}/>
            <Route path="/login" exact strict render={this.loginPage}/>
            <Route path="/ripple" exact strict render={this.RipplePage}/>
            <Route path="/qanda" exact strict render={this.QANDAPage}/>
            <Route path="/questions" exact strict render={this.questionsPage}/>
            <Route path="/map" exact strict render={this.mapPage}/>
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
        db={this.state.db}
        />
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
          />
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
          db={this.state.db}/>
        <MyQuestions
        user={this.state.user}
        isLoaded={this.isLoaded} 
        db={this.state.db}/> 
      </div>
    );
  }

  mapPage = (props) => {
    return (
      <div>
        <Header
          title="Map"
          description="Navigate your way to the main event." 
          db={this.state.db}/>
        <Map
        user={this.state.user}
        isLoaded={this.isLoaded} 
        db={this.state.db}/> 
      </div>
    );
  }

  EventPage = (props) => {
    return (
      <div>
        <Header
          title="Event"
          db={this.state.db}
          />
        <EventDetails
        user={this.state.user}
        isLoaded={this.isLoaded} 
        db={this.state.db}/>
      </div>
    );
  }

  faqPage = (props) => {
    return (
      <div>
        <Header
          title="FAQ"
          description="Find answers to your questions on food, parking, or anything in-between." 
          db={this.state.db}/>
        <Faq
          user={this.state.user}
          isLoaded={this.isLoaded} 
          db={this.state.db}/> 
      </div>
    );
  }
  
  RipplePage = (props) => {
    return (
      <div>
        <Header
          title="Ripple"
          description="See the reach of this conference and expand the Ripple Effect." 
          db={this.state.db}/>
        <BrainFood
        handleScroll={this.handleScroll}
        user={this.state.user}
        isLoaded={this.isLoaded}
        db={this.state.db}
        />
      </div>
    );
  }

  QANDAPage = () => {
    return (
      <div>
        <Header
          title="Q&amp;A"
          description="Ask questions and get personalized replies. Answered questions appear here, so check back to see if a speaker replies to you!"
          db={this.state.db} />
        <QANDA
        handleScroll={this.handleScroll}
        user={this.state.user}
        isLoaded={this.isLoaded}
        db={this.state.db}
        />
      </div>
    );
  }

  loginPage = (props) => {
    return (
      <div>
        <Header
          title="Login"
          description="" 
          db={this.state.db}/>
        <Login
        user={this.state.user}
        login={this.login}
        isLoaded={this.isLoaded} 
        db={this.state.db}/>
      </div>
    );
  }

  isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  componentDidMount = () => {
    let db = fire.firestore()
    let inactiveCount = 0;
    db.collection('active').get().then( snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().active) {
          // set the global reference for the proper database
          this.setState({
            db: doc.id
          }, () => this.getEventDate())}
        else if (doc.data().active === false) {
          inactiveCount++
        }
        if (snapshot.size === inactiveCount) {
          this.setState({
            noActiveEvents: true
          })
        }
      })
    })
  }

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
    if (isIOS && !this.isInStandaloneMode()) {
      type = "iPhone"
      this.setState({
        iosPopUp: isIOS,
      })
    }
    if ((!isAndroid) && (!isIOS)) {
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
            /** Doc exists, so the username is not available */
            return
          }
          else {
            that.sendFingerprintToFirestore(type, id)
          }
        })
    });
  }

  sendFingerprintToFirestore = (type, id) => {
    let timeAccessed = moment().format('MMMM Do YYYY, h:mm:ss a');
    let db = fire.firestore()
    db.collection(this.state.db).doc('audience').collection('audience').doc(id.toString()).set({
      id, type, timeAccessed
    }, () => this.setState({
      fingerprint: id
    }))
  }


  logout = () => {
    auth.signOut()
      .then(() => {
        window.location.reload();
      });
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user);
        localStorage.setItem('userEmail', user.email);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
      }
    });
  }
}

export default App;