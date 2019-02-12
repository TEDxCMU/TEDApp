import React, { Component } from 'react';
import './App.css';
import { auth } from './fire';
import { Schedule } from './components/schedule/schedule.js';
import { EventDetails } from './components/event/eventDetails.js';
import { Navigation } from './components/navigation/navigation.js';
import { Login } from './components/login/login.js';
import { MyQuestions } from './components/questions/myQuestions.js';
import { PopUp } from './components/addToHome/addToHome.js';
import { BrainFood } from './components/brains/brains.js';
import { Map } from './components/map/map.js';
// import { BrowserRouter as Router} from 'react-router-dom';
import { Router, Route } from 'react-router-dom'
// import Route from 'react-router-dom/Route';
import fire from './fire.js';
import Faq from './components/faq/faq';
import StyleGuide from './components/styleguide';
import { isAndroid, isIOS } from "react-device-detect";
import Fingerprint from "fingerprintjs2";

import Popup from 'react-popup';
import moment from 'moment';
import Header from './components/header/header';
// import ReactGA from 'react-ga';

// ReactGA.initialize('UA-134356076-1');
// ReactGA.pageview('/home');


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: [],
      iosPopUp: false,
      chromePopUp: false,
      burgerColor: "#fff",
      loaded: false
    }
    //pass THIS to global navigation hamburger menu so people can login and logout everywhere
    this.authListener = this.authListener.bind(this);
    this.logout = this.logout.bind(this)
  }

  render() {
    // console.log(window.location.pathname)
    // console.log("the current user is: ", auth.currentUser)
    // console.log("this is an iOS device? ", this.state.iosPopUp)
    // console.log("the popup will show up? ", JSON.parse(localStorage.getItem("popup")))
    // console.log("the fingerprint is: ", localStorage.getItem("fingerprint"))
    // console.log("the state is loaded: ", this.state.loaded)
    return (
      <div>
        <Router history={this.props.history}>
          <div className="App">
          <Navigation loaded={this.state.loaded} user={this.state.user} burgerColor={this.state.burgerColor} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
          <Route path="/" exact strict render={this.schedulePage}/>
          <Route path="/events/:id" exact strict component={EventDetails}/>
          <Route path="/faq" exact strict render={this.faqPage}/>
          {/* <Route path="/styleguide" exact strict render={this.styleGuidePage}/> */}
          <Route path="/login" exact strict render={this.loginPage}/>
          <Route path="/brainFood" exact strict render={this.BrainFoodPage}/>
          <Route path="/questions" exact strict render={this.questionsPage}/>
          <Route path="/map" exact strict render={this.mapPage}/>
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
        {/* <ul>{listOfData}</ul> */}
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

  navigationPage = (uzer) => {
    return(
      <div>
        <Navigation
          user= {uzer} 
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
        {this.state.loaded ? 
          // now the main app div will be 100% of the total screen real estate, which means the popup appears at the bottom
          <div style= {{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Schedule
              user={this.state.user}
              isLoaded={this.isLoaded}
              scroll={this.state.scroll} /> 
          </div>
          :
          // now the main app div will be 100% of the VIEW PORT real estate, which means the loader will be centered
          <div style= {{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Schedule
              user={this.state.user}
              isLoaded={this.isLoaded}
              scroll={this.state.scroll} /> 
          </div>
      }
      </div>

    );
  }

  questionsPage = (props) => {
    return (
      <div>
        <Header
          title="My Questions"
          description="Find answers to your questions here." />
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
          description="Find answers to your questions on food, parking, or anything in-between." />
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
  
  BrainFoodPage = (props) => {
    return (
      <div>
        <Header
          title="Brain Food"
          description="See how the conference is going and increase your impact." />
        <BrainFood
          user={this.state.user}
          isLoaded={this.isLoaded} /> 
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

  componentWillUnmount = () => {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
      let scrollTop = window.scrollY
      if (window.location.pathname === "/") {
        return this.setState({burgerColor: '#fff',
                      scroll: window.scrollY});
      }
      else if (scrollTop > 300) {
        // Setting burger to red
        this.setState({burgerColor: "red",
                      scroll: window.scrollY})
      }
      else if (scrollTop < 300) {
        // Setting burger to white
        this.setState({burgerColor: "white",
                      scroll: window.scrollY})
      }

  }
  
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
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
				// console.log(localStorage.getItem('fingerprint'))
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