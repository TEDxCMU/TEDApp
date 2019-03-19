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
// import { BrowserRouter as Router} from 'react-router-dom';
import { Router, Route, Switch} from 'react-router-dom'
// import Route from 'react-router-dom/Route';
import fire from './fire.js';
import Faq from './components/faq/faq';
import StyleGuide from './components/styleguide';
import { isAndroid, isIOS } from "react-device-detect";
import Fingerprint from "fingerprintjs2";
import error404 from './404.png';

import Popup from 'react-popup';
import moment from 'moment';
import Header from './components/header/header';
import QANDA from './components/brains/subComponents/qAndAMain';

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
    return (
      <div>
        <Router history={this.props.history}>
          <div className="App">
          <Navigation loaded={true} user={this.state.user} burgerColor={this.state.burgerColor} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
          <Switch>
          <Route path="/" exact strict render={this.schedulePage}/>
          <Route path="/:id" exact strict component={EventDetails}/>
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
        description=  {error}  />
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
              scroll={window.scrollY} /> 
          </div>
      </div>

    );
  }

  questionsPage = (props) => {
    return (
      <div>
        <Header
          title="My Questions"
          description="See what the audience is saying, and give them your two cents!" />
        <MyQuestions
        user={this.state.user}
        isLoaded={this.isLoaded} /> 
      </div>
    );
  }

  mapPage = (props) => {
    return (
      <div>
        <Header
          title="Map"
          description="Navigate your way to the main event." />
        <Map
        user={this.state.user}
        isLoaded={this.isLoaded} /> 
      </div>
    );
  }

  EventPage = (props) => {
    return (
      <div>
        <Header
          title="Event"
          />
        <EventDetails
        user={this.state.user}
        isLoaded={this.isLoaded} />
      </div>
    );
  }

  faqPage = (props) => {
    return (
      <div>
        <Header
          title="FAQ"
          description="Find answers to your questions on food, parking, or anything in-between." />
        <Faq
          user={this.state.user}
          isLoaded={this.isLoaded} /> 
      </div>
    );
  }
  
  RipplePage = (props) => {
    return (
      <div>
        <Header
          title="Ripple"
          description="See the reach of this conference and expand the Ripple Effect." />
        <BrainFood
        handleScroll={this.handleScroll}
        user={this.state.user}
        isLoaded={this.isLoaded}
        />
      </div>
    );
  }

  QANDAPage = () => {
    return (
      <div>
        <Header
          title="Q&amp;A"
          description="Ask questions and get personalized replies. Answered questions appear here, so check back to see if a speaker replies to you!" />
        <QANDA
        handleScroll={this.handleScroll}
        user={this.state.user}
        isLoaded={this.isLoaded}
        />
      </div>
    );
  }

  styleGuidePage = (props) => {
    return (
      <div>
        <Header
          title="Style Guide"
          description="For personal reference." />
        <StyleGuide
          user={this.state.user}
          isLoaded={this.isLoaded} /> 
      </div>
    );
  }

  loginPage = (props) => {
    return (
      <div>
        <Header
          title="Login"
          description="" />
        <Login
        user={this.state.user}
        login={this.login}
        isLoaded={this.isLoaded} />
      </div>
    );
  }

  isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  componentDidMount = () => {
    // localStorage.removeItem("popup")
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
    let db = fire.firestore()
    const fpInstance = new Fingerprint();
    let that = this;
		fpInstance.get((id)=> {
        localStorage.setItem('fingerprint', id)
        db.collection('audience')
        .doc(localStorage.getItem('fingerprint'))
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
    let timeAccessed = moment().format('hh:mm A');
    let db = fire.firestore()
    db.collection("audience").doc(id.toString()).set({
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