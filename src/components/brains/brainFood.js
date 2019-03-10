import React, { Component } from 'react';
import '../../App.css';
import './brainFood.css';
import RippleMap from './subComponents/rippleMap.js';
import QAndAMain from './subComponents/qAndAMain.js';
import fire from '../../fire.js';
import Autocomplete from 'react-google-autocomplete';
import Popup from "reactjs-popup";
import bottle from '../../questionbottle.svg';
import moment from 'moment';
import ReactGA from 'react-ga';

export class BrainFood extends Component {
  constructor() {
    super();
    this.state = {
        page: 0,
        name: '',
        email: '',
        city: '',
        fingerprint: localStorage.getItem('fingerprint'),
        inDatabase: null,
        key: "AIzaSyDcMQLOO-WbqT-IopP9CmBzkmCBzoG67fQ"

    }
  }

  render () {
    console.log(this.state)
    let nameBlank = true;
    const style = {
        display: 'flex',
        justifyText: 'center',
        flexDirection: 'column',
        alignItems: 'space-between',
        padding: '40px 40px',
        width: '70%',
        border: 'none',
        borderRadius: '10px'
    }
    return (
        <div>
            <div className="pageSelect">
                <button id="left" className={this.state.page === 0 ? "selected" : "unselected"} onClick={e => this.switchPage(e, 0)}>Interact</button>
                <button id="right" className={this.state.page === 1 ? "selected" : "unselected"} onClick={e => this.switchPage(e, 1)}>Q & A</button>
            </div>
            {this.state.page === 0 ? 
            <div className="mapPage">
                <div className="question-btn-container">
                    { this.state.inDatabase !== null ?
                        <h6><button onClick={() => this.openModal()} className="question-btn question-pos" style={{position: 'static', margin: '0'}}> {this.state.inDatabase === true ? "Change Your City": "Ripple"}</button></h6>
                    :
                    <h6><button className="question-btn question-pos" style={{position: 'static', margin: '0', width: '80%'}}></button></h6>

                    }
                    <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                    contentStyle={style}
                    >
                    <div className="modal">
                        <div>
                            <h2>And where are you from?</h2>
                            <Autocomplete
                                style={{paddingLeft: '12px', padding: '1em 0', boxSizing: 'border-box !important', height: '20px', color: 'var(--tedgrey)', fontFamily: 'Open Sans, sans-serif', fontSize: '1em', lineHeight: '1em', width: '100%', background: "transparent", border: '1px solid #e9ebec'}}
                                onPlaceSelected={(place) => {
                                this.setState({city: place});
                                }}
                            />
                            <h4>Name:</h4>
                            <input type="text" style={{height: '20px'}} className="popup-input-small" required minLength="4" siz="10" name="name" value={this.state.name} placeholder={ nameBlank ? "Please add your name." : "Jane Doe..."} onChange={e => {this.handleChange(e)}}/>
                            <h4>Email:</h4>
                            <input type="text" style={{height: '20px'}} className="popup-input-small" minLength="4" siz="10" name="email" value={this.state.email} placeholder={ nameBlank ? "Please add your email." : "Jane@Doe.com..."} onChange={e => {this.handleChange(e)}}/>

                            <div className="popup-btns">
                                <button className="popup-btn-cancel" onClick={this.closeModal}>Cancel</button>
                                <button className="popup-btn-success button-primary" onClick={e => this.sendLocation(e)}>Submit</button>
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
                            <p>Thank you for telling us more about yourself! Check the Brain Food page later to see the Ripple Effect!</p>
                            <button className="popup-button-success button-primary" style={{width: '100%', borderRadius: '24px'}} onClick={this.closeConfirmation}>Ok</button>
                        </div>
                    </div>
                    </Popup>
                </div>
                <h1 style={{width: '90%'}}>A Global Ripple Effect</h1>
                <RippleMap/>
            </div>
            :
            <QAndAMain
            handleScroll={this.props.handleScroll}
            />
            }
        </div>

    )
  }

    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }

    // code to deal with location question popup  

    //this fires when the user closes the bottle popup - unfortunately can't run this when they click send
    closeConfirmation = () => {
        this.setState({
            confirmationOpen: false
        });
    }

    openConfirmation = (e) => {
        e.preventDefault()
        this.setState({confirmationOpen: true})
    }

    openModal = () => {
        this.setState({ open: true })
    }

    closeModal = () => {
        this.setState({ open: false })
    }

    closeModalandOpenConfirmation = () => {
        this.setState({
            confirmationOpen: true,
            open: false
        }, () => this.sendLocationToDB())
    }

    sendLocation = (e) => {
        e.preventDefault()
        if (this.state.email.length > 0 && this.state.name.length > 0) {
            this.closeModalandOpenConfirmation();
        }
        else {
            return;
        }
    }


    switchPage = (e, num) => {
        this.setState({
            page: num
        })
    }

    validate = (name, email) => {
        // true means invalid, so our conditions got reversed
        return {
          name: name.length === 0,
          email: email.length === 0,
        };
      }


    sendLocationToDB = () => {
        console.log("sending location")
        const { name, email } = this.state;
        let errors = this.validate(name, email);
        if (errors.name || errors.email) {
            // console.log("one or more is blank")
            return this.setState({
                errors: errors
            })
        }
        if (this.state.city === '') {
            return
        } 
        let now = moment().format('hh:mm A');
        let db = fire.firestore();
        let that = this;
        if (localStorage.getItem('fingerprint') === null) {
            db.collection("maps").add({
                lat: this.state.city.geometry.location.lat(this.state.city),
                lng: this.state.city.geometry.location.lng(this.state.city),
                name: this.state.name,
                email: this.state.email,
                timeAsked: now
            })
            .then(function() {
                // console.log("Document successfully written!")
                that.setState({
                    inDatabase: true
                },
                 () => ReactGA.event({
                    category: 'User',
                    action: 'Create Location without Fingerprint'
                  }));
                // window.location.reload();
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection("maps").doc(this.state.fingerprint).set({
                lat: this.state.city.geometry.location.lat(this.state.city),
                lng: this.state.city.geometry.location.lng(this.state.city),
                name: this.state.name,
                email: this.state.email,
                timeAsked: now
            })
            .then(function() {
                // console.log("Document successfully written!")
                that.setState({
                    inDatabase: true
                }, () => ReactGA.event({
                    category: 'User',
                    action: 'Create Location with Fingerprint'
                  }));
                // window.location.reload();
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }

    }


    componentDidMount = () => {
        console.log("hello! we logged BrainFood");
        this.props.isLoaded();
        let db = fire.firestore();
        const mapsRef = db.collection("maps").doc(localStorage.getItem("fingerprint"))
        mapsRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            mapsRef.onSnapshot((doc) => {
              this.setState({
                inDatabase: true    
              })
            });
          }
          else {
            this.setState({
                inDatabase: false    
              })
          }
      });
    }

}
  
export default BrainFood;