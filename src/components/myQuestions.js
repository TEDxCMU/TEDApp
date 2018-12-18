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
      console.log(this.props.user)
      console.log(this.props.user)
      console.log(this.state.questions)
      let currentUser = fire.auth().currentUser.email;
      console.log(currentUser);
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
                  answerQuestion={this.answerQuestion}
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
      if (fire.auth().currentUser === null) {
        return
      }
      let userEmail = fire.auth().currentUser.email;
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
      // speakerRef.get().then(snapshot => {
      //   console.log(snapshot.docs)
      //   snapshot.data().forEach(snap => {
      //     snap.collection("questions").get()
      //     .then(snapsh0t => {
      //       snapsh0t.forEach(doc => {
      //         wholeData.push(doc.data())
      //       })
      //     })
      //     if (wholeData.length === snap.data().size) {
      //       this.setState({
      //         questions: wholeData
      //       })
      //     }
      //   })
      // })
      // .then(snapsh0t => {
      //     snapsh0t.forEach(doc => {
      //         let docCopy = doc.data();
      //         console.log(docCopy)
      //         wholeData.push(docCopy)
      //     });
      //     // let questions = Array(wholeData.length)
      //   this.setState(
      //       {questions: wholeData
      //     }, () => console.log(this.state.questions))
      // })
  }
      
}
export default MyQuestions;