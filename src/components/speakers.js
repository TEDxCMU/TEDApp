import React, { Component } from 'react';
import '../App.css';
import './speakers.css';
import fire from '../fire.js';
import moment from 'moment';
import SpeakerComponent from './speakerComponent.js';

export class Speakers extends Component {
    constructor() {
      super();
      this.state = {
        allSpeakers: [],
        questions: new Array(9),
      }
    }

    render() {
        console.log(this.state.questions)
        let newList = [];
        this.state.allSpeakers.forEach(speaker => {    
            let index = this.state.allSpeakers.indexOf(speaker);
            console.log(index)
            let question = this.state.questions[index]
            console.log(question)
            newList.push (
                <SpeakerComponent 
                    logState={this.logState}
                    speaker={speaker} 
                    name={speaker.name} 
                    index={index} 
                    handleChange={this.handleChange} 
                    id={speaker.id} 
                    question={this.state.questions[index]} c
                    createQuestion={this.createQuestion}>
                </SpeakerComponent> 
            ) 
        })

      return (
        <div className="speakers">
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
    

    createQuestion = (speakerID, text, index) => {
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        let that = this;
        let speakersCopy = this.state.allSpeakers;
        console.log(index.index);
        db.collection("speakers").doc(speakerID.id).collection("questions").add({
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
        db.settings({
          timestampsInSnapshots: true
        });
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
            }, () => console.log(this.state.questions))
        })
    }
  }
  
export default Speakers;