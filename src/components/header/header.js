import React, { Component } from 'react';
import '../../App.css';
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

        let headerStyle = "header-container";
        if (this.props.headerStyle === "fixed") {
            if (this.props.link === false) {
                headerStyle = "header-container--sticky header-container--sticky-short"
            } else {
                headerStyle = "header-container--sticky"
            }
        } else {
            headerStyle = "header-container";
        }

        if (this.props.errors !== undefined) {
            nameBlank = this.props.errors.name
            questionBlank = this.props.errors.question
        }
        return (
            <header className={headerStyle}>
                {this.editEventAnnouncementPopup(popupStyle)}
                {/* The header should be collapsed, so make the description small */}
                { this.props.link !== undefined && this.props.link === false ?
                    this.collapsedHomeHeader()
                :
                    <Link key={'home'} to={{
                        pathname: '/',
                        state: {  
                        }
                        }}>
                    <img src={this.props.image === undefined ? logo : back} className={this.props.image === undefined ? "header__back header__back--logo" : "header__back header__back--arrow"} alt="TEDxCMU"></img>
                    </Link>   
                }
                <div className="header__content">
                    {this.props.speaker === true ?
                        this.speakerHeader(popupStyle, that, questionBlank, nameBlank)
                        :
                        this.regularHeader()
                    }
                </div>
                <div className="sp-16"></div>
            </header>
        );        
    }
    
    componentDidMount = () => {
        this.getAnnouncement();
    }

    // default handleChange for React forms
    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }
    
    // code for ask speaker question popup  
    // this fires when the user closes the bottle popup - unfortunately can't run this when they click send
    closeConfirmation = () => {
        this.props.close();
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

    // opens announcement modifier popup, only works if user signed in is Admin
    openAnnouncement = () => {
        if (this.props.isAdmin !== true) {
            return
        }
        this.setState({ announcementOpen: true })
    }


    // closes announcement modal
    closeAnnouncement = () => {
        if (this.props.isAdmin !== true) {
            return
        }
        this.setState({ announcementOpen: false })
    }


    // removes the custom announcement from the DB and closes the announcement modal
    deleteAnnouncement = (e) => {
        if (this.props.isAdmin !== true) {
            return
        }
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection(this.props.db).doc('announcement').delete().then(function() {
            that.setState({
                announcementOpen: false
            }, () => that.componentDidMount())
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
    
    // update announcement in the DB and then closes popup
    updateAnnouncement = (e) => {
        if (this.props.isAdmin !== true) {
            return
        }
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection(this.props.db).doc('announcement').update({
            text: this.state.announcement
        })
        .then(function() {
            that.setState({
                announcementOpen: false
            }, () => that.componentDidMount())
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    // creates a brand new announcement, if one does not exist already, and then closes the popup
    createAnnouncement = (e) => {
        if (this.props.isAdmin !== true) {
            return
        }
        e.preventDefault();
        let that = this;
        let db = fire.firestore();
        db.collection(this.props.db).doc('announcement').set({text: this.state.announcement}).then(
            that.setState({
                announcementOpen: false
            }, () => that.componentDidMount())
        )
        .catch(
            console.log("Error creating announcement!")
        )
    }

    getAnnouncement = () => {
        let that = this;
        let db = fire.firestore();
        if (this.props.db === undefined) {
            return
        }
        db.collection(this.props.db).doc('announcement').get().then(
            doc => {
                if (doc.exists) {
                    that.setState({
                        altAnnouncement: doc.data().text,
                        announcement: doc.data().text
                    })
                }
                else {
                    that.setState({
                        altAnnouncement: undefined
                    })
                } 
            }
        )
    }

    successAskQuestionPopup = (popupStyle) => {
        return (
            <Popup open={this.state.confirmationOpen} closeOnDocumentClick onClose={this.closeConfirmation} contentStyle={popupStyle}>
                <div className="popup">
                    <div className="popup__response">
                        <img src={bottle} className="bottle" alt="Bottle" />
                        <p className="text-center">Thank you for asking a question! Please check back on the Q&amp;A page later.</p>
                        <button className="btn btn-full btn-rounded btn--primary" onClick={this.closeConfirmation}>Ok</button>
                    </div>
                </div>
            </Popup>
        )
    }

    confirmAskQuestionPopup = (popupStyle) => {
        return (
            <Popup open={this.state.openCheck} closeOnDocumentClick onClose={this.closeCheck} contentStyle={popupStyle}>
                <div className="popup">
                    <div>
                        <h4>Ready to send off?</h4>
                        <h6>To prevent spam, you are limited to one question per speaker.</h6>
                        <div className="popup__btn-group">
                            <button className="btn btn-full btn--cancel" onClick={this.closeCheck}>Go Back</button>
                            <button className="btn btn-full btn--primary" onClick={e => this.sendQuestion(e)}>Confirm</button>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }

    askQuestionPopup = (popupStyle, that, questionBlank, nameBlank) => {
        return (
            <Popup open={this.state.open} closeOnDocumentClick onClose={this.closeModal} contentStyle={popupStyle}>
                <div className="popup">
                    <div>
                        <h4>Dear {this.props.title},</h4>
                        <textarea type="text" id="iOS" required autoComplete="off" className={this.state.errors === undefined || this.state.errors.question === false ? "popup__input" : "popup__input popup__input--invalid"} name="question" value={that.props.question} placeholder={questionBlank ? "Please write a question before submitting." : "Write your question here..."} onChange={that.props.handleChange} />
                        {this.state.errors === undefined ?
                            null
                            :
                            <small className="text-red">Please ask a question before submitting.</small>}
                        <h4>Sincerely, </h4>
                        <input type="text" className="popup__input popup__input__sm" autoComplete="off" value={that.props.name} required minLength="4" size="10" name="name" placeholder={nameBlank ? "Please add your name." : "Your name..."} onChange={that.props.handleChange} />
                        <div className="popup__btn-group">
                            <button className="btn btn-full btn--cancel" onClick={this.closeModal}>Cancel</button>
                            <button className="btn btn-full btn--primary" onClick={this.openCheck}>Submit</button>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }

    editEventAnnouncementPopup = (popupStyle) => {
        return (
        <Popup open={this.state.announcementOpen} closeOnDocumentClick onClose={this.closeAnnouncement} contentStyle={popupStyle}>
                <div className="popup">
                    <div>
                        {this.state.altAnnouncement !== undefined ?
                            <div>
                                <h4>Change or delete custom announcement:</h4>
                                <div className="popup__btn-group">
                                    <button className="btn btn-full btn--primary" onClick={e => this.deleteAnnouncement(e)}>Delete</button>
                                </div>
                                <textarea type="text" id="iOS" required className="popup__input" name="announcement" value={this.state.announcement} placeholder={"Make a new custom announcement."} onChange={e => this.handleChange(e)} />
                                <div className="popup__btn-group">
                                    <button className="btn btn-full btn--primary" onClick={e => this.updateAnnouncement(e)}>Update</button>
                                </div>
                            </div>
                            :
                            <div>
                                <h4>Create custom announcement</h4>
                                <textarea type="text" id="iOS" required className="popup__input" name="announcement" placeholder={"Make it bold, keep it short!"} onChange={e => this.handleChange(e)} />
                                <div className="popup__btn-group">
                                    <button className="btn btn-full btn--cancel" onClick={this.closeAnnouncement}>Cancel</button>
                                    <button className="btn btn-full btn--primary" onClick={e => this.createAnnouncement(e)}>Confirm</button>
                                </div>
                            </div>}
                    </div>
                </div>
            </Popup>
        )
    }

    regularHeader = () => {
        return (
            <div>
                {this.props.link === false ?
                    null
                    :
                    <div>
                        <h1 className="header__title">{this.props.title}</h1>
                        <div>
                            {this.props.description !== undefined && this.state.altAnnouncement === undefined ?
                                <h6 onClick={this.openAnnouncement} className="header__desc">{Parser(this.props.description.toString())}</h6>
                                :
                                null
                                }
                            {this.props.description !== undefined && this.state.altAnnouncement !== undefined ?
                                <h6 onClick={this.openAnnouncement} className="header__desc">{Parser(this.state.altAnnouncement.toString())}</h6>
                                :
                                null
                                }
                        </div>
                    </div>}
            </div>
        )
    }

    speakerHeader = (popupStyle, that, questionBlank, nameBlank) => {
        return (
            <div className="header__profile">
                {this.props.image !== undefined ?
                    <div className="relative">
                        <div className="header__img--border"></div>
                        <img className="header__img" alt="speaker" src={this.props.image}></img>
                    </div>
                    :
                    null}
                <br />
                <h1 className="header__title">{this.props.title}</h1>
                {this.props.tag !== undefined ?
                    <div>
                        <h6 className="header__desc text-center">{this.props.tag}</h6>
                    </div>
                    :
                    null}
                {this.props.twitter !== undefined ?
                    <div className="twitter-icon">
                        <SocialIcon network="twitter" rel="noopener noreferrer" url={this.props.twitter} taget="_blank" fgColor="#ffffff" bgColor="rgba(0,0,0,0)" />
                    </div>
                    :
                    null}
                {this.props.asked === true ?
                    // prevent user from asking multiple questions, if we have their device fingerprint on file
                    <div>
                        <button className="q-btn">Asked</button>
                    </div>
                    :
                    <div>
                        <button onClick={() => this.openModal()} className="btn q-btn">Ask Question</button>
                        {this.askQuestionPopup(popupStyle, that, questionBlank, nameBlank)}
                        {this.confirmAskQuestionPopup(popupStyle)}
                        {this.successAskQuestionPopup(popupStyle)}
                    </div>}
            </div>
        )
    }

    collapsedHomeHeader = () => {
        return (
            <div>
                {this.props.description !== undefined && this.state.altAnnouncement === undefined ?
                    <div>
                        <h6 onClick={this.openAnnouncement} className="header__desc header__desc--collapsed">{Parser(this.props.description.toString())}</h6>
                    </div>
                    :
                    null
                    }

                {this.props.description !== undefined && this.state.altAnnouncement !== undefined ?
                    <div>
                        <h6 onClick={this.openAnnouncement} className="header__desc header__desc--collapsed">{Parser(this.state.altAnnouncement.toString())}</h6>
                    </div>
                    :
                    null
                    }
            </div>
        )
    }
};

export default Header;