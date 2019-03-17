import React, { Component } from 'react';
import '../../../App.css';
import './qAndA.css';
import '../../questions/myQuestions.css';
import fire from '../../../fire.js';
import Dropdown from '../../dropdown/dropdown';
import Popup from "reactjs-popup";
import bottle from '../../../questionbottle.svg';
import moment from 'moment';
import ReactGA from 'react-ga';


export class QAndAMain extends Component {
    constructor() {
        super();
        this.state = {
            questions: null,
            speaker: 'pfelterm@andrew.cmu.edu',
            question: '',
            name: '',
            errors: {name: false, question: false},
            confirmationOpen: false,
            open: false
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

    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });
    }

    // code for ask speaker question popup  
    //this fires when the user closes the bottle popup - unfortunately can't run this when they click send
    closeConfirmation = () => {
        this.setState({
            asked: true
        })
    }


    openConfirmation = (e) => {
        e.preventDefault()
        this.setState({confirmationOpen: true})
    }


    // opens the pop-up modal
    openModal = () => {
        this.setState({ open: true })
    }

    // closes the popup modal
    closeModal = () => {
        this.setState({ open: false })
    }

    // function fired on the submit button for the Ask Question popup
    // calls closeModalandOpenConfirmation, which then actually sends the question
    sendQuestion = (e) => {
        e.preventDefault()
        if (this.state.question.length > 0 && this.state.name.length > 0) {
            this.setState({
                confirmationOpen: true,
                open: false
            }, () => this.createQuestion())
        }
        else {
            return;
        }
    }

    checkIfAsked = () => {
        const db = fire.firestore()
        if (localStorage.getItem('fingerprint') === null) {
            return this.setState({
                asked: false
            })
        }
        db.collection('speakers')
        .doc(this.state.speaker)
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

    validate = (name, question) => {
        // true means invalid, so our conditions got reversed
        return {
          name: name.length === 0,
          question: question.length === 0,
        };
      }

    createQuestion = () => {
        const { name, question } = this.state;
        let errors = this.validate(name, question);
        if (errors.name || errors.question) {
            return this.setState({
                errors: errors
            })
        } 
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        if (localStorage.getItem('fingerprint') === null) {
            db.collection("speakers").doc(this.state.speaker).collection("questions").add({
                question: this.state.question,
                name: this.state.name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                ReactGA.event({
                    category: 'User',
                    action: 'Create Question without Fingerprint on Q&A Page'
                }, () => this.componentDidMount())
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection("speakers").doc(this.state.speaker).collection("questions").doc(localStorage.getItem('fingerprint')).set({
                question: this.state.question,
                name: this.state.name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                ReactGA.event({
                    category: 'User',
                    action: 'Create Question with Fingerprint on Q&A Page'
                }, () => this.componentDidMount())
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }

    // get speaker info based on which speaker is currently selected
    checkSpeaker = () => {
        const db = fire.firestore();
        db.collection('speakers')
        .doc(this.state.speaker)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return this.setState({
                speakerRef: doc.data()
            }, () => this.checkIfAsked())
          }
          else {
            return this.setState({
                speakerRef: null
            })
          }
        })
    }

    render () {
        let nameBlank = true;
        let questionBlank = true;
        const style = {
            display: 'flex',
            justifyText: 'center',
            flexDirection: 'column',
            alignItems: 'space-between',
            padding: '30px 40px',
            width: '70%',
            border: 'none',
            borderRadius: '10px'
        }
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
                        <label style={{marginTop: '0'}}>FROM: {question.name}</label>
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
            <div className="content">
            {this.state.asked !== undefined ? 
                <div>
                { this.state.asked === true ?
                    // prevent user from asking multiple questions, if we have their device fingerprint on file
                    <div className="questi0n-btn-container">
                        <h6><button className="questi0n-btn question-pos-asked">Asked</button></h6>
                    </div>
                :
                    <div className="questi0n-btn-container">
                        <h6><button onClick={() => this.openModal()} className="questi0n-btn question-pos">Ask Question</button></h6>
                        <Popup
                        open={this.state.open}
                        closeOnDocumentClick
                        onClose={this.closeModal}
                        contentStyle={style}
                        >
                        <div className="modal">
                            <div>
                                <h4>Dear {this.state.speakerRef.first + " " + this.state.speakerRef.last},</h4>
                                <textarea type="text" id="iOS" required className="popup-input" name="question" placeholder={ questionBlank ? "Please write a question before submitting." : "Write your question here..."} onChange={this.handleChange}/>
                                <h4>Sincerely, </h4>
                                <input type="text" style={{height: '20px'}} className="popup-input-small" required minLength="4" siz="10" name="name" placeholder={ nameBlank ? "Please add your name." : "Jane Doe..."} onChange={this.handleChange}/>
                                <div className="popup-btns">
                                    <button className="popup-btn-cancel" onClick={this.closeModal}>Cancel</button>
                                    <button className="popup-btn-success button-primary" onClick={e => this.sendQuestion(e)}>Submit</button>
                                </div>
                            </div>
                        </div>
                        </Popup>
                        <Popup
                        open={this.state.confirmationOpen}
                        closeOnDocumentClick
                        onClose={this.closeConfirmation}
                        contentStyle={style}
                        >
                        <div className="modal">
                            <div className="popup-response">
                                <img src={bottle} className="bottle" alt="Bottle" />
                                <p>Thank you for asking a question! Please check back on the Brain Food page later.</p>
                                <button className="popup-button-success button-primary" style={{width: '100%', borderRadius: '24px'}} onClick={this.closeConfirmation}>Ok</button>
                            </div>
                        </div>
                        </Popup>
                    </div>
                }
                </div>
            :
                <div></div>
            }
                {this.state.questions !== null ?
                    <div className="speakers">
                        {newList}
                    </div>
                    :
                    <div className="speakers"></div>
                }
            </div>

      </div>
    )
  }

  componentWillUnmount = () => {
    window.addEventListener('scroll', this.props.handleScroll);
  }

  componentDidMount = () => {
    window.removeEventListener('scroll', this.props.handleScroll);
    const db = fire.firestore();
    var wholeData = [];
    db.collection('speakers').doc(this.state.speaker).collection("questions").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let docCopy = doc.data();
            docCopy.id = doc.id;
            docCopy.answered = false;
            wholeData.push(docCopy)
        });
      this.setState(
        {questions: wholeData,
        confirmationOpen: false}
        , () => this.checkSpeaker())
    })
  }

}
  
export default QAndAMain;