import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../App.css';
import './speakers.css';
import fire from '../fire.js';
import Dropdown from './dropdown';

export class MyQuestions extends Component {
    constructor() {
      super();
      this.state = {
        allSpeakers: [],
        questions: new Array(500),
      }
    }

    
    render() {
    let time = this.props.time;
    let question = this.props.question;
    let index = this.props.index;
    let answer = this.props.answer;
    let id = this.props.id;

    return (
        <div className="speakers">
            <Dropdown title={question}>
                <form align='center'>
                    <label align='center'>Answer Question</label>
                    <input type="text" name={index} value={question} onChange={this.props.handleChange}/>
                    <button type="button" className="button-primary" onClick={() => this.props.logState()}>Log state</button>
                    {/* {this.props.speaker.asked === true ? 
                    <div>
                        <button type="button" className="button-sent">Sent</button>
                    </div>     
                    :
                    <div>
                        <button type="button" className="button-primary" onClick={() => this.props.createQuestion({id}, {question}, {index})}>Send</button>
                    </div>     
                    }            */}
                </form>
            </Dropdown>
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