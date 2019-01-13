import React, { Component } from 'react';
import '../../App.css';
import './eventDetails.css';
import '../speakers/speakers.css';
import Header from '../header/header.js'
import fire from '../../fire.js';
import moment from 'moment';
import SpeakerComponent from '../speakers/speakerComponent.js';

export class EventDetails extends Component {
    constructor() {
      super();
      this.state = {
        question: '',
        name: '',
        errors: {name: false, question: false},
      }
      this.handleChange = this.handleChange.bind(this)
    }

    render() {
        let self = this.state;
            return (
                <div>    
                { this.state.asked !== undefined ? 
                <div>
                    <Header
                    title={self.speaker.first + ' ' + self.speaker.last} 
                    image={self.speaker.image}
                    email={self.speaker.email}
                    twitter={self.speaker.twitter}
                    tag={self.speaker.tag}
                    speaker={true}
                    asked={this.state.asked}
                    askQuestion={this.createQuestion}
                    handleChange={this.handleChange}
                    question={this.state.question}
                    name={this.state.name}
                    errors={this.state.errors}
                    />
                    <div className="event-details">
                        { self.speaker !== undefined ?
                        <div className="info-container">
                            <p className="talk">TEDxCMU Talk</p>
                            
                            <h6 className="talk-title">{self.props.title}</h6>
                            <p>{self.props.description}</p>

                            <h6 className="bio">Speaker Bio</h6>
                            <p>{self.speaker.bio}</p>


                        </div>
                        :
                        <div></div>
                        }
                    </div>
                </div>
                :
                <div></div>
                }
                </div>
              ); 
        }

    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }

    validate = (name, question) => {
        // true means invalid, so our conditions got reversed
        return {
          name: name.length === 0,
          question: question.length === 0,
        };
      }

    createQuestion = () => {
        console.log("asking question")
        const { name, question } = this.state;
        let errors = this.validate(name, question);
        console.log(errors)
        if (errors.name || errors.question) {
            console.log("one or more is blank")
            return this.setState({
                errors: errors
            })
        } 
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        let that = this;
        if (localStorage.getItem('fingerprint') === null) {
            db.collection("speakers").doc(this.state.speaker.email).collection("questions").add({
                question: this.state.question,
                name: this.state.name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                console.log("Document successfully written!")
                that.setState({
                    asked: true
                })
                // window.location.reload();
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection("speakers").doc(this.state.speaker.email).collection("questions").doc(localStorage.getItem('fingerprint')).set({
                question: this.state.question,
                name: this.state.name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                console.log("Document successfully written!")
                that.setState({
                    asked: true
                })
                // window.location.reload();
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }

    }

    componentDidMount = () => {
        console.log(this.state.asked)
        let props = this.props.location.state
        this.setState({props}, () => 
        this.checkSpeaker())

    }

    checkIfAsked = () => {
        const db = fire.firestore()
        if (localStorage.getItem('fingerprint') === null) {
            return this.setState({
                asked: false
            })
        }
        db.collection('speakers')
        .doc(this.state.speaker.email)
        .collection('questions')
        .doc(localStorage.getItem('fingerprint'))
        .get()
        .then((doc) => {
          if (doc.exists) {
            /** Doc exists, so the username is not available */
            return this.setState({
                asked: true
            })
          }
          else {
            return this.setState({
                asked: false
            })
          }
        })
    }

    checkSpeaker = () => {
        const db = fire.firestore();
        var speakerRef = db.collection('speakers').doc(this.props.location.state.speaker)
        speakerRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            console.log('Document data:', doc.data());
            this.setState({
                speaker: doc.data()
            }, () => this.checkIfAsked())
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }

  }
  
export default EventDetails;