import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../App.css';
import './speakers.css';
import fire from '../fire.js';
import QuestionComponent from './questionComponent.js'
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';

export class MyQuestions extends Component {
    constructor() {
      super();
      this.state = {
        answers: new Array(500),
        questions: new Array(500),
        id: null
      }
      this.componentDidMount = this.componentDidMount.bind(this);
    }


    render() {
      let newList = [];
      this.state.questions.forEach(question => {    
          let index = this.state.questions.indexOf(question);
          newList.push (
              <QuestionComponent
                  key={question.id}
                  index={index}
                  question={question.question}  
                  answer={question.answer} 
                  time={question.time} 
                  answerQuestion={this.answerQuestion}
                  id={question.id}>
              </QuestionComponent> 
          ) 
      })

    return (
      <div className="speakers">
          {newList}
      </div>
    );
  }

  answerQuestion = (id, text) => {
    let email = fire.auth().currentUser.email;
    let now = moment().format('hh:mm A');
    let db = fire.firestore();
    db.collection("speakers").doc(email).collection("questions").doc(id).set({
        answer: text,
        timeAnswered: now
    })
    .then(function() {
        console.log("Document successfully written!")
        // window.location.reload();
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  componentDidMount = () => {
    if (fire.auth().currentUser === null && localStorage.getItem('userEmail') === undefined) {
      console.log("returning")
      return
    }
    let userEmail = localStorage.getItem('userEmail');
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = [];
  
    let speakerRef = db.collection('speakers').where('email', '==', userEmail);
    console.log(speakerRef)
    db.collection('speakers').doc(userEmail).collection("questions").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let docCopy = doc.data();
            docCopy.id = doc.id;
            console.log(docCopy)
            wholeData.push(docCopy)
        });
        // let questions = Array(wholeData.length)
      this.setState(
          {questions: wholeData
        }, () => console.log(this.state.questions))
    })
  }


      
}
export default MyQuestions;