import React, { Component } from 'react';
//import '../../App.css';
import './brains.css';
import '../questions/myQuestions.css';
import fire from '../../fire.js';
import Dropdown from '../dropdown/dropdown';


export class BrainFood extends Component {
  constructor() {
    super();
    this.state = {
      questions: null,
      speaker: 'rscarano@andrew.cmu.edu'
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  toggleRoma = () => {
      this.setState({ speaker: 'rscarano@andrew.cmu.edu'});
  }

  toggleEric = () => {
      this.setState({ speaker: 'ericc2@andrew.cmu.edu'});
  }

  toggleQuinn = () => {
      this.setState({ speaker: 'qrz@andrew.cmu.edu'});
  }
  
  toggleSanjana = () => {
      this.setState({ speaker: 'sjobalia@andrew.cmu.edu'});
  }

  render () {
    let romaClasses = "button-primary medium blank";
    let ericClasses = "button-primary medium blank";
    let quinnClasses = "button-primary medium blank";
    let sanjanaClasses = "button-primary medium blank";
    let newList = [];
    if (this.state.questions !== null) {
      this.state.questions.forEach(question => {  
        if (question.answer !== "") {
          let index = this.state.questions.indexOf(question);
          newList.push (
            <div className="speaker">
              <Dropdown question={question.question}>
                  <form className="questions-form">
                      <label style={{marginTop: '0'}}>Question:</label>
                      <p>"{question.question}"</p>
                      <p>FROM: {question.name}</p>
                      <p>Answer: </p>
                      <p>"{question.answer}"</p>
                  </form>
              </Dropdown>
            </div>
          )
        }  
 
    })
    if (this.state.speaker === 'rscarano@andrew.cmu.edu') {
        romaClasses = "button-primary medium";
    } else {
        romaClasses += "button-primary medium blank";
    }
    if (this.state.speaker === 'ericc2@andrew.cmu.edu') {
        ericClasses = "button-primary medium";
    } else {
        ericClasses += "button-primary medium blank";
    }
    if (this.state.speaker === 'qrz@andrew.cmu.edu') {
        quinnClasses = "button-primary medium";
    } else {
        quinnClasses = "button-primary medium blank";
    }
    if (this.state.speaker === 'sjobalia@andrew.cmu.edu') {
      sanjanaClasses = "button-primary medium";
    } else {
      sanjanaClasses = "button-primary medium blank";
    }

    }
    return (
      <div className="faq">
          <div className="justified">
              <button onClick={this.toggleRoma} style={{boxShadow: 'none'}} className={romaClasses}>Roma</button>
              <button onClick={this.toggleEric} style={{boxShadow: 'none'}} className={ericClasses}>Eric</button>
              <button onClick={this.toggleSanjana} style={{boxShadow: 'none'}} className={sanjanaClasses}>Sanjana</button>
              <button onClick={this.toggleQuinn} style={{boxShadow: 'none'}} className={quinnClasses}>Quinn</button>
          </div>
          {this.state.questions !== null ?
          <div className="speakers">
            {newList}
          </div>
          :
          <div className="speakers">
            <h1>No questions answered yet!</h1>
          </div>
          }

      </div>
    )
  }

  componentDidMount = () => {
    const db = fire.firestore();
    var wholeData = [];
    let speakerRef = db.collection('speakers').where('email', '==', this.state.speaker);
    db.collection('speakers').doc(this.state.speaker).collection("questions").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let docCopy = doc.data();
            docCopy.id = doc.id;
            docCopy.answered = false;
            wholeData.push(docCopy)
        });
        // let questions = Array(wholeData.length)
      console.log(wholeData)
      this.setState(
        {questions: wholeData}, () => this.props.isLoaded()
      )
    })
  }

}
  
export default BrainFood;