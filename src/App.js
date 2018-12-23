import React, { Component } from 'react';
import './App.css';
import { auth, provider } from './fire';
import { NewSchedule } from './components/schedule/newSchedule.js';
import { EventDetails } from './components/event/eventDetails.js';
import { Navigation } from './components/navigation/navigation.js';
import { Login } from './components/login/login.js';
import { MyQuestions } from './components/questions/myQuestions.js'
import { BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import fire from './fire.js';
import Faq from './components/faq/faq';
import Speakers from './components/speakers/speakers';
import StyleGuide from './components/styleguide';
import Footer from './components/footer/footer';
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
    this.authListener = this.authListener.bind(this);
    this.logout = this.logout.bind(this)

  }
  render() {
    console.log("RENDERING MAIN APP")
    console.log(auth.currentUser)
    var listOfData = this.state.allData.map((val, i)=>{
      var name = val.name
      var age = val.age
      return (
        <li key={i}>{name} ({age})</li>
      ) 
    })

    return (

      <div>
        
        <Router>
          <div className="App">
          <Navigation user={this.state.user} logout={this.logout} isiPhone={this.state.iosPopUp} isAndroid={this.state.chromePopUp}/>
          <Route path="/" exact strict render={this.schedulePage}/>
          <Route path="/events/:id" exact strict component={EventDetails}/>
          <Route path="/faq" exact strict render={this.faqPage}/>
          <Route path="/styleguide" exact strict render={this.styleGuidePage}/>
          <Route path="/login" exact strict render={this.loginPage}/>
          {/* if (localStorage.getItem("user") === null || auth().currentUser === null ?) {
            <div>
             <Route path="/questions" exact strict render={this.questionsPage}/>
             </div>
          }
          </div> */}
          <Route path="/questions" exact strict render={this.questionsPage}/>
          </div>
        </Router>
        
        <div style={{display: 'flex', flexDirection: "column", alignItems:"center"}}> 
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
        </div>
        {/* <ul>{listOfData}</ul> */}
        <Footer />
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  navigationPage = (uzer) => {
    return(
      <Navigation
      user= {uzer} 
      login={this.login} 
      logout={this.logout} 
      isiPhone={this.state.iosPopUp} 
      isAndroid={this.state.chromePopUp}
      />
    )
  }

  schedulePage = (props) => {
    return (
      <NewSchedule
      user={this.state.user} /> 
    );
  }

  questionsPage = (props) => {
    return (
      <MyQuestions
      user={this.state.user} /> 
    );
  }

  EventPage = (props) => {
    return (
      <EventDetails
      user={this.state.user} /> 
    );
  }

  faqPage = (props) => {
    return (
      <Faq
      user={this.state.user} /> 
    );
  }

  styleGuidePage = (props) => {
    return (
      <StyleGuide
      user={this.state.user} /> 
    );
  }

  loginPage = (props) => {
    return (
      <Login
      user={this.state.user}
      login={this.login} /> 
    );
  }

  speakersPage = (props) => {
    return (
      <Speakers
      user={this.state.user} /> 
    );
  }

  componentDidMount() {
    this.authListener();
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