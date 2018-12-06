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
    }

    
    render() {
      console.log(this.state.questions)
      let newList = [];
      this.state.questions.forEach(question => {    
          let index = this.state.questions.indexOf(question);
          console.log(index)
          let q = this.state.questions[index]
          console.log(question)
          newList.push (
              <QuestionComponent
                  index={index}
                  question={q.question}  
                  answer={q.answer} 
                  time={q.time} 
                  answerQuestion={this.createQuestion}
                  id={this.state.id}>

              </QuestionComponent> 
          ) 
      })

    return (
      <div className="speakers">
          {newList}
      </div>
    );
  }


    componentDidMount = () => {
      const db = fire.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      var wholeData = [];
      let speakerID = "wLs9MTPHfZk5AbebslaQ"
      db.collection('speakers').doc(speakerID).collection("questions").get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              let docCopy = doc.data();
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