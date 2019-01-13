import React, { Component } from 'react';
import '../../App.css';
import HeaderBG from '../../header-bg.svg';
import logo from '../../logo.png';
import back from '../../back.png';
import bottle from '../../questionbottle.svg';
import { Link } from 'react-router-dom';
import './header.css';
import { SocialIcon } from 'react-social-icons';
// import Popup from 'react-popup';
import Popup from "reactjs-popup";

export class Header extends Component {
    constructor (props) {
        super(props)
        this.state = {
          menuOpen: false,
          open: false
        }
    }

    // handleAskQuestion () {
    //     let that = this;
    //     const style = {
    //         display: 'flex',
    //         justifyText: 'center',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         paddingTop: '50px'
    //     }
    //     let nameBlank = this.props.errors.name
    //     let questionBlank = this.props.errors.question
    //     console.log(nameBlank, questionBlank)
    //     Popup.create({
    //         title: null,
    //         content: <div><h4>Dear {this.props.title},</h4><textarea type="text" id="iOS" required className="mm-popup__input" name="question" placeholder={ questionBlank ? "Please write a question before submitting ." : "Write your question here..."} onChange={that.props.handleChange}/><h4>Sincerely, </h4><textarea type="text" style={{height: '20px'}} className="mm-popup__input__small" required minLength="4" siz="10" className="mm-popup__input" name="name" placeholder={ nameBlank ? "Please add your name." : "Jane Doe..."} onChange={that.props.handleChange}/></div>,
    //         buttons: {
    //             left: ['cancel'],
    //             right: [{
    //                 text: 'Send',
    //                 className: 'success',
    //                 action: function () {
    //                     if (that.props.question.length > 0 && that.props.name.length > 0) {
    //                         that.props.askQuestion()
    //                         Popup.create({
    //                             title: null,
    //                             content: <div style={style}><img src={bottle} className="bottle" alt="Bottle" /><p>Thank you for asking a question! Please check back on the Q&amp;A page later.</p></div>,
    //                             buttons: {
    //                                 right: ['ok']
    //                             }
    //                         });
    //                         // Popup.alert('Thank you for asking a question! Please check back on the Q&A page later.');
    //                         Popup.close();
    //                     }
    //                     else {
    //                         that.props.askQuestion()
    //                     }
    //                 }
    //             }]
    //         }
    //     });
    // }

    closeMenu () {
        this.setState({menuOpen: false})
      }

    toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
    }

    openModal = () => {
        this.setState({ open: true })
      }

    closeModal = () => {
        this.setState({ open: false })
    }

    sendQuestion = () => {
        if (this.props.question.length > 0 && this.props.name.length > 0) {
            this.props.askQuestion()
            this.closeModal();
        }
        else {
            return;
        }
    }

    render() {
        let that = this;
        console.log(this.props)
        let nameBlank = true;
        let questionBlank = true;
        if (this.props.errors !== undefined) {
            nameBlank = this.props.errors.name
            questionBlank = this.props.errors.question
        }
        return (
            <header className="sticky">
                <Link key={'home'} to={{
                    pathname: '/',
                    state: {  
                    }
                    }}>
                 <img src={this.props.image === undefined ? logo : back} className={this.props.image === undefined ? "logo" : "arrow"} alt="TEDxCMU"></img>
                </Link>
                {/* <div className="header-bg">
                    <img src={HeaderBG} alt="header background"></img>
                </div> */}
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
                                    <h6 className="description">{this.props.tag}</h6>
                                </div>
                            :
                                <div></div>
                            }
                            { this.props.twitter !== undefined ?
                                <div>
                                    <SocialIcon network="twitter" rel="noopener noreferrer" url={this.props.twitter} taget="_blank" fgColor="#ffffff" bgColor="rgba(0,0,0,0)" />
                                </div>
                            :
                                <div></div>
                            }
                            { this.props.asked === true ?
                                <div className="question-btn-container">
                                    <h6><button className="question-btn">Asked</button></h6>
                                </div>
                            :
                                <div className="question-btn-container">
                                    {/* <h6><button onClick={() => this.handleAskQuestion()} className="question-btn">Ask Question</button></h6> */}
                                    <h6><button onClick={() => this.openModal()} className="question-btn">Ask Question</button></h6>
                                    <Popup
                                    open={this.state.open}
                                    closeOnDocumentClick
                                    onClose={this.closeModal}
                                    >
                                    <div className="modal" style={{display: "flex", flexDirection: 'column'}}>
                                        <div>
                                            <h4>Dear {this.props.title},</h4>
                                            <textarea type="text" id="iOS" required className="mm-popup__input" name="question" placeholder={ questionBlank ? "Please write a question before submitting." : "Write your question here..."} onChange={that.props.handleChange}/>
                                            <h4>Sincerely, </h4>
                                            <input type="text" style={{height: '20px'}} className="mm-popup__input__small" required minLength="4" siz="10" className="mm-popup__input" name="name" placeholder={ nameBlank ? "Please add your name." : "Jane Doe..."} onChange={that.props.handleChange}/>
                                            <button align="center" style={{marginTop: '20px'}} onClick={this.sendQuestion}>Fire Away</button>
                                        </div>
                                    </div>
                                    </Popup>
                                </div>
                            }

                        </div>
                        :
                        <div>
                            <h1 className="title">{this.props.title}</h1>
                            <h6 className="description">{this.props.description}</h6>
                        </div>
                    }
                </div>
                <div className="bottom-space"></div>
            </header>
        );        
    }
};

export default Header;