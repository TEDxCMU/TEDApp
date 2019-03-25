import React, { Component } from 'react';
import '../../App.css';
// import HeaderBG from '../../header-bg.svg';
import logo from '../../logo.svg';
import back from '../../back.svg';
import bottle from '../../questionbottle.svg';
import { Link } from 'react-router-dom';
import './header.css';
import { SocialIcon } from 'react-social-icons';
import Popup from "reactjs-popup";
import fire from '../../fire.js';
import Parser from 'html-react-parser';

export class Header extends Component {
    constructor (props) {
        super(props)
        this.state = {
          confirmationOpen: false,
          open: false,
          announcementOpen: false,
          announcement: '',
          openCheck: false
        }
    }

    render = () => {
        let that = this;
        let nameBlank = true;
        let questionBlank = true;
        const popupStyle = {
            display: 'flex',
            justifyText: 'center',
            flexDirection: 'column',
            alignItems: 'space-between',
            padding: '20px 20px',
            width: '80%',
            border: 'none',
            borderRadius: '10px'
          }

        let headerStyle = "sticky";
        if (this.props.headerStyle === "fixed") {
            if (this.props.link === false) {
                headerStyle = "sticky-header short"
            } else {
                headerStyle = "sticky-header"
            }
        } else {
            headerStyle = "sticky";
        }

        if (this.props.errors !== undefined) {
            nameBlank = this.props.errors.name
            questionBlank = this.props.errors.question
        }
        return (
            <header className={headerStyle}>
                <Popup
                    open={this.state.announcementOpen}
                    closeOnDocumentClick
                    onClose={this.closeAnnouncement}
                    contentStyle={popupStyle}
                    >
                    <div className="modal">
                        <div>
                            { this.props.altAnnouncement !== null && this.props.altAnnouncement ?
                                <div>   
                                    <h4>Change or delete custom announcement:</h4>
                                    <div className="popup-btns">
                                        <button className="popup-btn-success button-primary" onClick={e => this.deleteAnnouncement(e)}>Delete</button>
                                    </div>
                                    <textarea type="text" id="iOS" required className="popup-input" name="announcement" placeholder={ "Make a new custom announcement."} onChange={e => this.handleChange(e)}/>
                                    <div className="popup-btns">
                                        <button className="popup-btn-success button-primary" onClick={e => this.updateAnnouncement(e)}>Update</button>
                                    </div>
                                </div>
                            :
                                <div>
                                <h4>Create custom announcement</h4>
                                <textarea type="text" id="iOS" required className="popup-input" name="announcement" placeholder={ "Make it bold, keep it short!"} onChange={e => this.handleChange(e)}/>
                                <div className="popup-btns">
                                    <button className="popup-btn-cancel" onClick={this.closeAnnouncement}>Cancel</button>
                                    <button className="popup-btn-success button-primary" onClick={e => this.createAnnouncement(e)}>Confirm</button>
                                </div>                      
                                </div>
                            }

                        </div>
                    </div>
                </Popup>
                {/* The header should be collapsed, so make the description small */}
                { this.props.link !== undefined && this.props.link === false ?
                    <div>
                        {this.props.description !== undefined ?
                            <div>
                                <h6 onClick={this.openAnnouncement} className="description-small">{Parser(this.props.description.toString())}</h6>
                            </div>
                            :
                            <div></div>
                        }
                    </div>

                :
                    <Link key={'home'} to={{
                        pathname: '/',
                        state: {  
                        }
                        }}>
                    <img src={this.props.image === undefined ? logo : back} className={this.props.image === undefined ? "logo" : "arrow"} alt="TEDxCMU"></img>
                    </Link>   
                }
                <div className="header-content">
                    {this.props.speaker === true ?
                        <div className="speaker-header">
                            { this.props.image !== undefined ?
                                <div className="image-container">
                                    <div className="image-border">
                                        <img className="image" alt="speaker" src={this.props.image}></img>
                                    </div>
                                </div>
                            :
                                <div></div>
                            }
                            <br />
                            <h1>{this.props.title}</h1>
                            { this.props.tag !== undefined ?
                                <div>
                                    <h6 className="description-tag">{this.props.tag}</h6>
                                </div>
                            :
                                <div></div>
                            }
                            { this.props.twitter !== undefined ?
                                <div className="twitter-icon">
                                    <SocialIcon network="twitter" rel="noopener noreferrer" url={this.props.twitter} taget="_blank" fgColor="#ffffff" bgColor="rgba(0,0,0,0)" />
                                </div>
                            :
                                <div></div>
                            }
                            { this.props.asked === true ?
                                // prevent user from asking multiple questions, if we have their device fingerprint on file
                                <div className="question-btn-container">
                                    <h6><button className="question-btn question-pos-asked">Asked</button></h6>
                                </div>
                            :
                                <div className="question-btn-container">
                                    <h6><button onClick={() => this.openModal()} className="question-btn question-pos">Ask Question</button></h6>
                                    <Popup
                                    open={this.state.open}
                                    closeOnDocumentClick
                                    onClose={this.closeModal}
                                    contentStyle={popupStyle}
                                    >
                                    <div className="modal">
                                        <div>
                                            <h4 style={{marginTop: '5px'}}>Dear {this.props.title},{/* <sup style={{color: 'red'}}>*</sup> */}</h4>
                                            <textarea type="text" id="iOS" required autoComplete="off" className={this.state.errors === undefined || this.state.errors.question === false ? "popup-input" : "popup-input-invalid" } name="question" value={that.props.question} placeholder={ questionBlank ? "Please write a question before submitting." : "Write your question here..."} onChange={that.props.handleChange}/>
                                            {this.state.errors === undefined ?
                                                <small> </small>
                                            :
                                                <small className="small-red">Please ask a question before submitting.</small>
                                            }  
                                            <h4>Sincerely, </h4>
                                            <input type="text" style={{height: '20px'}} className="popup-input-small" autoComplete="off" value={that.props.name} required minLength="4" size="10" name="name" placeholder={ nameBlank ? "Please add your name." : "Your name..."} onChange={that.props.handleChange}/>                                       
                                            <div className="popup-btns">
                                                <button className="popup-btn-cancel" onClick={this.closeModal}>Cancel</button>
                                                <button className="popup-btn-success button-primary" onClick={this.openCheck}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                    </Popup>
                                    <Popup
                                    open={this.state.openCheck}
                                    closeOnDocumentClick
                                    onClose={this.closeCheck}
                                    contentStyle={popupStyle}
                                    >
                                    <div className="modal">
                                        <div>
                                            <h4>Ready to send off? </h4>
                                            <h6 style={{color: 'black'}}>To prevent spam, you are limited to one question per speaker.</h6>
                                            <div className="popup-btns">
                                                <button className="popup-btn-cancel" onClick={this.closeCheck}>Go Back</button>
                                                <button className="popup-btn-success button-primary" onClick={e => this.sendQuestion(e)}>Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                    </Popup>
                                    <Popup
                                    open={this.state.confirmationOpen}
                                    closeOnDocumentClick
                                    onClose={this.closeConfirmation}
                                    contentStyle={popupStyle}
                                    >
                                    <div className="modal">
                                        <div className="popup-response">
                                            <img src={bottle} className="bottle" alt="Bottle" />
                                            <p className="confirmation-text">Thank you for asking a question! Please check back on the Q&amp;A page later.</p>
                                            <button className="popup-button-success button-primary" style={{width: '100%', borderRadius: '24px'}} onClick={this.closeConfirmation}>Ok</button>
                                        </div>
                                    </div>
                                    </Popup>
                                </div>
                            }

                        </div>
                        :
                        <div>
                            {this.props.link === false ?
                            <div></div>
                            :
                            <div>
                                {/* This is a normal header, so put the title and description in where they should be */}
                                <h1 className="title">{this.props.title}</h1>
                                <div>
                                    {this.props.description !== undefined ?
                                        <div>
                                            <h6 onClick={this.openAnnouncement} className="description">{Parser(this.props.description.toString())}</h6>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </div>
                            </div>
                            }
                        </div>
                    }
                </div>
                <div className="bottom-space"></div>
            </header>
        );        
    }
    

    // default handleChange for React forms
    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }
    
    // code for ask speaker question popup  
    //this fires when the user closes the bottle popup - unfortunately can't run this when they click send
    closeConfirmation = () => {
        this.props.close();
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

    // opens the "are you sure" pop-up modal
    openCheck = () => {
        const { question } = this.props;
        let errors = this.props.validate(question);
        if (errors.question) {
            return this.setState({
                errors: errors
            })
        }
        this.setState({ 
            openCheck: true,
            open: false
        })
    }

        // closes the "are you sure" popup modal
    closeCheck = () => {
        const { name, question } = this.state;
        this.setState({ 
            open: true,
            openCheck: false,
            name: name,
            question: question,
            errors: undefined
        })
    }    

    // function fired on the submit button for the Ask Question popup
    // calls closeModalandOpenConfirmation, which then actually sends the question
    sendQuestion = (e) => {
        e.preventDefault()
        if (this.props.question.length > 0) {
            this.closeModalandOpenConfirmation();
        }
        else {
            return;
        }
    }

    // on submit, closes the popup and then automatically opens the confirmation
    // then asks the question using the createQuestion function from eventDetails.js
    closeModalandOpenConfirmation = () => {
        this.setState({
            confirmationOpen: true,
            open: false
        }, () => this.props.askQuestion())
    }

    // opens announcement modifier popup, only works if user signed in is Admin (dijour@cmu.edu)
    openAnnouncement = () => {
        if (localStorage.getItem("userEmail") !== "dijour@cmu.edu") {
            return
        }
        this.setState({ announcementOpen: true })
    }


    // closes announcement modal
    closeAnnouncement = () => {
        if (localStorage.getItem("userEmail") !== "dijour@cmu.edu") {
            return
        }
        this.setState({ announcementOpen: false })
    }


    // removes the custom announcement from the DB and closes the announcement modal
    deleteAnnouncement = (e) => {
        if (localStorage.getItem("userEmail") !== "dijour@cmu.edu") {
            return
        }
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection('announcements').doc('announcement').delete().then(function() {
            that.setState({
                announcementOpen: false
            })
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
    
    // update announcement in the DB and then closes popup
    updateAnnouncement = (e) => {
        if (localStorage.getItem("userEmail") !== "dijour@cmu.edu") {
            return
        }
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection('announcements').doc('announcement').update({
            text: this.state.announcement
        })
        .then(function() {
            that.setState({
                announcementOpen: false
            })
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    // creates a brand new announcement, if one does not exist already, and then closes the popup
    createAnnouncement = (e) => {
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection('announcements').doc('announcement').set({text: this.state.announcement}).then(
            that.setState({
                announcementOpen: false
            })
        )
        .catch(
            console.log("Error creating announcement!")
        )
    }

    
};

export default Header;