import React, { Component } from 'react';
import '../../../App.css';
import './qAndA.css';
import '../../questions/myQuestions.css';
import fire from '../../../fire.js';
import Dropdown from '../../dropdown/dropdown';


export class QAndAMain extends Component {
  constructor() {
    super();
    this.state = {
      questions: null,
      speaker: 'pfelterm@andrew.cmu.edu'
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  toggleParker = () => {
      this.setState({ speaker: 'pfelterm@andrew.cmu.edu'},
      () => this.componentDidMount());
  }

  toggleRana = () => {
      this.setState({ speaker: 'rsen@deloitte.com'},
      () => this.componentDidMount());
  }

  toggleMicah = () => {
    this.setState({ speaker: 'msr@andrew.cmu.edu'},
    () => this.componentDidMount());
  }

  toggleDeepa = () => {
    this.setState({ speaker: 'dbiya1@gmail.com'},
    () => this.componentDidMount());
  }

  toggleRob = () => {
    this.setState({ speaker: 'rob@thephluidproject.com'},
    () => this.componentDidMount());
  }

  toggleDrJ = () => {
    this.setState({ speaker: 'janjicj@duq.edu'},
    () => this.componentDidMount());
  }

  toggleJane = () => {
      this.setState({ speaker: 'jane@forca.com'},
      () => this.componentDidMount());
  }

  render () {
    // console.log(this.state.questions)
    let parkerClasses = "button-primary medium blank";
    let ranaClasses = "button-primary medium blank";
    let micahClasses = "button-primary medium blank";
    let deepaClasses = "button-primary medium blank";
    let robClasses = "button-primary medium blank";
    let drJClasses = "button-primary medium blank";
    let janeClasses = "button-primary medium blank";
    let newList = [];
    if (this.state.questions !== null) {
      this.state.questions.forEach(question => {  
        if (question.answer.length > 0 ) {
          newList.push (
            <div className="speaker" key={Math.random()}>
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
    if (this.state.speaker === 'pfelterm@andrew.cmu.edu') {
        parkerClasses = "button-primary medium";
    } else {
        parkerClasses += "button-primary medium blank";
    }
    if (this.state.speaker === 'rsen@deloitte.com') {
        ranaClasses = "button-primary medium";
    } else {
        ranaClasses += "button-primary medium blank";
    }
    if (this.state.speaker === 'msr@andrew.cmu.edu') {
        micahClasses = "button-primary medium";
    } else {
        micahClasses = "button-primary medium blank";
    }
    if (this.state.speaker === 'dbiya1@gmail.com') {
        deepaClasses = "button-primary medium";
    } else {
        deepaClasses = "button-primary medium blank";
    }
    if (this.state.speaker === 'rob@thephluidproject.com') {
        robClasses = "button-primary medium";
    } else {
        robClasses = "button-primary medium blank";
    }
    if (this.state.speaker === 'janjicj@duq.edu') {
        drJClasses = "button-primary medium";
    } else {
        drJClasses = "button-primary medium blank";
    }
    if (this.state.speaker === 'jane@forca.com') {
        janeClasses = "button-primary medium";
    } else {
        janeClasses = "button-primary medium blank";
    }

    }
    return (
      <div className="faq">
          <div className="justified">
              <button onClick={this.toggleParker} style={{boxShadow: 'none'}} className={parkerClasses}>Parker</button>
              <button onClick={this.toggleRana} style={{boxShadow: 'none'}} className={ranaClasses}>Rana</button>
              <button onClick={this.toggleMicah} style={{boxShadow: 'none'}} className={micahClasses}>Micah</button>
              <button onClick={this.toggleDeepa} style={{boxShadow: 'none'}} className={deepaClasses}>Deepa</button>
              <button onClick={this.toggleRob} style={{boxShadow: 'none'}} className={robClasses}>Rob</button>
              <button onClick={this.toggleDrJ} style={{boxShadow: 'none'}} className={drJClasses}>Dr. J</button>
              <button onClick={this.toggleJane} style={{boxShadow: 'none'}} className={janeClasses}>Jane</button>
          </div>
          {this.state.questions !== null ?
            <div className="speakers">
              {newList}
            </div>
          :
            <div className="speakers"></div>
          }

      </div>
    )
  }

  componentWillUnmount = () => {
    window.addEventListener('scroll', this.props.handleScroll);
  }

  componentDidMount = () => {
    console.log("QANDA mounted")
    window.removeEventListener('scroll', this.props.handleScroll);
    const db = fire.firestore();
    var wholeData = [];
    db.collection('speakers').doc(this.state.speaker).collection("questions").get()
    .then(snapshot => {
        console.log(snapshot)
        snapshot.forEach(doc => {
            console.log(doc.data())
            let docCopy = doc.data();
            docCopy.id = doc.id;
            docCopy.answered = false;
            wholeData.push(docCopy)
        });
      this.setState(
        {questions: wholeData})
    })
  }

}
  
export default QAndAMain;