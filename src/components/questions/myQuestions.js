import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../../App.scss';
import '../questions/myQuestions.scss';
import fire from '../../fire.js';
import QuestionComponent from './questionComponent.js'
import moment from 'moment';
import { Redirect } from 'react-router-dom';

export class MyQuestions extends Component {
    constructor() {
      super();
      this.state = {
        redirectHome: false
      }
      this.componentDidMount = this.componentDidMount.bind(this);
    }

    render() {
      if (this.state.redirectHome) {
        return <Redirect to="/"/>
      }
      if (this.state.questions === undefined) {
        return null
      }

      let newList = [];
      this.state.questions.forEach(question => {    
          let index = this.state.questions.indexOf(question);
          newList.push(
              <QuestionComponent
                  key={question.id}
                  index={index}
                  question={question.question}  
                  answer={question.answer}
                  answered={question.answered} 
                  time={question.time} 
                  answerInDB={question.answerInDB}
                  answerQuestion={this.answerQuestion}
                  id={question.id}
                  name={question.name}
                  close={this.state.close}>
              </QuestionComponent> 
          );
      })

    return (
      <div>
          {fire.auth().currentUser !== null && <div className="text-center">Account: {fire.auth().currentUser.email}</div> }
          <div className="">
          {newList}
          </div>
      </div>
    );
  }

  answerQuestion = (id, text, index) => {
    let email = fire.auth().currentUser.email;
    let now = moment().format('MMMM Do YYYY, h:mm:ss a');
    let db = fire.firestore();
    // need to make an instance of this class so we can access it further down in the function
    let that = this;
    let questionsCopy = this.state.questions; 
    db.collection(this.props.db).doc('speakers').collection('speakers').doc(email).collection("questions").doc(id).update({
        answer: text,
        timeAnswered: now
    })
    .then(function() {
        questionsCopy[index].answered = true;
        that.setState({
            questions: questionsCopy,
            close: index
        }, () => that.setClose(index))
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  // close the specific question component we just answered
  setClose = (index) => {
    this.setState({
      close: index
    }, () => this.componentDidMount());
  }

  componentDidMount = () => {
    if (fire.auth().currentUser === null || localStorage.getItem('userEmail') === null) {
      this.setState({
        redirectHome: true
      });
      return;
    }
    let userEmail = localStorage.getItem('userEmail');
    const db = fire.firestore();

    var wholeData = [];
    db.collection(this.props.db).doc('speakers').collection('speakers').doc(userEmail).collection("questions").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let docCopy = doc.data();
            docCopy.id = doc.id;
            if (docCopy.answer !== "") {
              docCopy.answerInDB = true
            }
            docCopy.answered = false;
            wholeData.push(docCopy)
        });
      this.setState(
        { questions: wholeData }, () => this.props.isLoaded()
      );
    });
  }
}
export default MyQuestions;