import React, { Component } from 'react';
import '../../App.css';
import '../questions/myQuestions.css';
import fire from '../../fire.js';
import moment from 'moment';
import SpeakerComponent from './speakerComponent.js';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';

const SpeakerPage = ({match}) => {
    return ( <h1> Welcome User {match.params.username} </h1> );
  }

export class Speakers extends Component {
    constructor() {
      super();
      this.state = {
        allSpeakers: [],
        questions: new Array(9),
      }
    }

    render() {
        let newList = [];
        this.state.allSpeakers.forEach(speaker => {    
            let index = this.state.allSpeakers.indexOf(speaker);
            let question = this.state.questions[index];
            newList.push (
                <SpeakerComponent 
                    logState={this.logState}
                    speaker={speaker} 
                    name={speaker.first + ' ' + speaker.last} 
                    index={index} 
                    handleChange={this.handleChange} 
                    email={speaker.email}
                    question={this.state.questions[index]}
                    createQuestion={this.createQuestion}>
                </SpeakerComponent> 
            ) 
        })

        

      return (
        <div className="speakers">
            {this.state.allSpeakers.map((speaker) => {
                return(
                    <div>
                    <Link to={{
                        pathname: '/speakers/'+speaker.first+speaker.last.toString(),
                        state: {
                            email: speaker.email,
                            name: speaker.first + ' ' + speaker.last

                        }}}>
                    <li key={speaker.email}>
                        <h6>Hello {speaker.first}</h6>
                    </li>
                    </Link>
                    
                    <Route path={`/speakers/:speakerId`} exact strict component={SpeakerPage}/>
                    </div>
                );
            })}
            {newList}    
        </div>
      ); 
    }

    logState = () => {
        console.log(this.state.questions[0])
    }

    handleChange = (e) => {
        const index = e.target.name
        let newQuestions = this.state.questions;
        newQuestions[index] = e.target.value;
        this.setState({
            questions: newQuestions
        })
      }
    

    createQuestion = (email, text, index) => {
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        let that = this;
        let speakersCopy = this.state.allSpeakers;
        db.collection("speakers").doc(email.email).collection("questions").add({
            question: text.question,
            answer: "",
            time: now
        })
        .then(function() {
            console.log("Document successfully written!")
            speakersCopy[index.index].asked = true;
            that.setState({
                allSpeakers: speakersCopy
            })
            // window.location.reload();
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    componentDidMount = () => {
        const db = fire.firestore();
        // db.settings({
        //   timestampsInSnapshots: true
        // });
        var wholeData = [];
        let questions = new Array(9);
        for (let q in questions) {
            q = " ";
        }
        db.collection('speakers').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let docCopy = doc.data();
                docCopy.asked = false;
                wholeData.push(docCopy)
            });
            // let questions = Array(wholeData.length)
          this.setState(
              {allSpeakers: wholeData, 
               questions: questions
              })
        })
    }
  }
  
export default Speakers;