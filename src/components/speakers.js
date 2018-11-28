import React, { Component } from 'react';
import '../App.css';
import './speakers.css';
import Dropdown from './dropdown';
import fire from '../fire.js';
import moment from 'moment';
import SpeakerComponent from './speakerComponent.js';

export class Speakers extends Component {
    constructor() {
      super();
      this.state = {
        allSpeakers: [],
        questions: new Array(9),
        speaker1question: '',
        speaker2question: '',
        speaker3question: '',
        speaker4question: '',
        speaker5question: '',
        speaker6question: '',
        speaker7question: '',
        speaker8question: '',
        speaker9question: ''
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
                <SpeakerComponent logState={this.logState} name={speaker.name} index={index} handleChange={this.handleChange} id={speaker.id} question={this.state.questions[index]} createQuestion={this.createQuestion}></SpeakerComponent> 
            ) 
        })

      return (
        <div className="speakers">
            {newList}
            {/* <Dropdown title="Dawn Wacek">
                Hey there friend whats poppin
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                    <br /> 
                </div>
                <form align='center'>
                    <label align='center'>Ask Question</label>
                    <input type="text" name="speaker1question" value={this.state.speaker1question} onChange={this.handleChange}/>
                    <button type="button" className="button-primary" onClick={() => this.createQuestion("fZY3AV7Z7h8yoon2euq5", this.state.speaker1question)}>Send</button>
                </form>
            </Dropdown>
            <Dropdown title="Freddy White">
                Hi a wonderful world...
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
            </Dropdown>
            <Dropdown title="Mary Short">
                Hi a wonderful world...
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
            </Dropdown> */}
        </div>
      );
    }

    logState = () => {
        console.log(this.state.questions[0])
    }

    handleChange = (e) => {
        const index = e.target.name
        console.log('name is ', e.target.name)
        console.log('value is ', e.target.value)
        console.log('index is: ', index)
        let newQuestions = this.state.questions;
        newQuestions[index] = e.target.value;
        this.setState({
            questions: newQuestions
        })
        // this.setState({[name]: e.target.value});
      }
    
    arrayChangeHandler = (index, text) => {
        let newQuestions = this.state.questions;
        newQuestions[index] = text;
        this.setState({
            questions: newQuestions
        })
    }

    createQuestion = (speakerID, text) => {
        console.log('THe id is: ', speakerID.id)
        console.log("THe TExT is: ", text);
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        db.collection("speakers").doc(speakerID.id).collection("questions").add({
            question: text.question,
            answer: "",
            time: now
        })
        .then(function() {
            console.log("Document successfully written!");
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
                wholeData.push(doc.data())
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