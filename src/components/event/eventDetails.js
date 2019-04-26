import React, { Component } from 'react';
import '../../App.css';
import './eventDetails.css';
import '../questions/myQuestions.css';
import Header from '../header/header.js'
import fire from '../../fire.js';
import moment from 'moment';
import ReactGA from 'react-ga';

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
        let videos = [];
        if (self.props !== undefined) {
            for (let video in self.props.related) {
                videos.push(
                    this.makeVideoListElement(video, self)
                )
            }      
        }
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
                close={this.closeConfirmationPopup}
                errors={this.state.errors}
                validate={this.validate}
                db={self.db}
                isAdmin={self.isAdmin}
                />
                {this.eventDetailsRender(self, videos)}
            </div>
            :
            <div>
                <Header db={self.db} isAdmin={self.isAdmin} />
            </div>
            }
            </div>
        ); 
    }

    //Render Functions
    eventDetailsRender = (self, videos) => {
        return <div className="event-details">
            {self.speaker !== undefined ?
                <div className="info-container">
                    <p className="talk">TEDxCMU Talk</p>

                    <h6 className="talk-title">{self.props.title}</h6>
                    <p>{self.props.description}</p>

                    <h6 className="bio">Speaker Bio</h6>
                    <p>{self.speaker.bio}</p>

                    <h6 className="talk-title">Related TED Talks</h6>
                    <div className="videos">
                        {videos}
                    </div>
                </div>
                :
                <div></div>}
        </div>;
    }

    makeVideoListElement = (video, self) => {
        return <div key={video} style={{ maxWidth: '100%' }}>
            <div style={{ position: "relative", height: "0", paddingBottom: "56.25%" }}>
                <iframe src={self.props.related[video]} title={self.props.related[video]} style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }} frameBorder="0" scrolling="no" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}>
                </iframe>
            </div>
            <br></br>
        </div>;
    }

    //Regular Functions
    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }

    validate = (question) => {
        // true means invalid, so our conditions got reversed
        return {
          question: question.length === 0,
        };
      }

    createQuestion = () => {
        const question = this.state.question;
        let errors = this.validate(question);
        if (errors.question) {
            return this.setState({
                errors: errors
            })
        }
        if (this.props.location.state === undefined) {
            return
        }
        var name = this.state.name;
        if (name === "")  {
            name = "anonymous"
        }
        let now = moment().format('MMMM Do YYYY, h:mm:ss a');
        let db = fire.firestore();
        if (localStorage.getItem('fingerprint') === null) {
            db.collection(this.props.location.state.db).doc('speakers').collection('speakers').doc(this.state.speaker.email).collection("questions").add({
                question: this.state.question,
                name: name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                ReactGA.event({
                    category: 'User',
                    action: 'Create Question without Fingerprint on Speaker Page'
                  })
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection(this.props.location.state.db).doc('speakers').collection('speakers').doc(this.state.speaker.email).collection("questions").doc(localStorage.getItem('fingerprint')).set({
                question: this.state.question,
                name: name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                ReactGA.event({
                    category: 'User',
                    action: 'Create Question with Fingerprint on Speaker Page'
                  })
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }

    }

    closeConfirmationPopup = () => {
        this.setState({
            asked: true
        })
    }

    componentDidMount = () => {
        // reset scroll to top of the page in case someone scrolled from previous page really fast
        window.scrollTo(0, 0);
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
        if (this.props.location.state === undefined) {
            return
        }
        db.collection(this.props.location.state.db).doc('speakers').collection('speakers')
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
        if (this.props.location.state === undefined) { 
            window.location.href="/" 
        }
        const db = fire.firestore();
        var speakerRef = db.collection(this.props.location.state.db).doc('speakers').collection('speakers').doc(this.props.location.state.speaker)
        speakerRef.get()
        .then(doc => {
          if (!doc.exists) {
          } else {
            this.setState({
                speaker: doc.data()
            }, () => this.checkIfAsked())
          }
        })
        .catch(err => {
        });
    }
  }
  
export default EventDetails;