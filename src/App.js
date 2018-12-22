import React, { Component } from 'react';
import './App.css';
import { auth, provider } from './fire';
import { BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import fire from './fire.js';

import { NewSchedule } from './components/schedule/newSchedule.js';
import { Navigation } from './components/navigation/navigation';
import { Login } from './components/login/login.js';
import Faq from './components/faq/faq';
import Speakers from './components/speakers/speakers';
import StyleGuide from './components/styleguide';
import Header from './components/header/header';

import { isAndroid, isIOS } from "react-device-detect";


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: [],
      iosPopUp: false,
      chromePopUp: false
    }
    //pass THIS to global navigation hamburger menu so people can login and logout everywhere
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

  }
  render() {
    var listOfData = this.state.allData.map((val, i)=>{
      var name = val.name
      var age = val.age
      return (
        <li key={i}>{name} ({age})</li>
      ) 
    })

    return (

      <div className="App">
        <Router>
          <div>
            <Navigation user={this.state.user} login={this.login} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
            <Route path="/" exact strict render={this.schedulePage}/>
            <Route path="/faq" exact strict render={this.faqPage}/>
            <Route path="/speakers" exact strict render={this.speakersPage}/>
            <Route path="/styleguide" exact strict render={this.styleGuidePage}/>
            <Route path="/login" exact strict render={this.loginPage}/>
          </div>
        </Router>
        {/* <div style={{display: 'flex', flexDirection: "column", alignItems:"center"}}> 
          {this.state.chromePopUp === true ? 
          <button align="center">Add app to Android Home Screen!</button>
          :
          <div align="center"></div>
          }
          <br/>
          {this.state.iosPopUp === true ? 
          <button align="center">Add app to iOS Home Screen!</button>
          :
          <div align="center"></div>
          }
        </div> */}
        {/* <ul>{listOfData}</ul> */}
        {/* <Footer /> */}
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  schedulePage = (props) => {
    return (
      <div>
        <Header
          title="Live Schedule" 
          description="The next talk by Po Shen Loh starts in 5 minutes in McConomy Auditorium." />
        <NewSchedule
          user={this.state.user} /> 
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
          user={this.state.user} /> 
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
          user={this.state.user} /> 
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
          login={this.login} /> 
      </div>
    );
  }

  speakersPage = (props) => {
    return (
      <div>
        <Header
          title="Speakers"
          description="Learn about the six phenomenal speakers talking today." />
        <Speakers
          user={this.state.user} />
      </div>
       
    );
  }

  componentDidMount() {
    // console.log(this.state)
    if (isAndroid) {
      this.setState({
        chromePopUp: isAndroid,
      })
    }
    if (isIOS) {
      this.setState({
        iosPopUp: isIOS,
      })
    }

    // console.log(this.state.user)
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('member').orderBy('name', 'asc').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        wholeData.push(doc.data())
      });
      // console.log(wholeData)
      this.setState({allData: wholeData})
      // console.log(this.state.allData)
    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login = (data) => {
    console.log("hello")
    
    let userInfo = data;
    console.log(userInfo)
      console.log("Logging you in!")
      this.setState({
        user: userInfo
      }, () => console.log(this.state.user))
  }
}

export default App;