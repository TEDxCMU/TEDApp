import React, { Component } from 'react';
import '../../App.css';
import './brainFood.css';
import RippleMap from './subComponents/rippleMap.js';
import fire from '../../fire.js';
import Autocomplete from 'react-google-autocomplete';
import Popup from "reactjs-popup";
import bottle from '../../questionbottle.svg';
import moment from 'moment';
import ReactGA from 'react-ga';
import * as EmailValidator from 'email-validator';

export class BrainFood extends Component {
  constructor() {
    super();
    this.state = {
        name: '',
        email: '',
        city: '',
        fingerprint: localStorage.getItem('fingerprint'),
        inDatabase: null,
        key: "AIzaSyDcMQLOO-WbqT-IopP9CmBzkmCBzoG67fQ" // database key
    }
  }

  render () {
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
        <div className="mapPage">
            <h1 style={{width: '90%'}}>A Global Ripple Effect</h1>
            <div>
                {this.addLocationButton()}
                {this.locationInputPopup(style)}
                {this.locationConfirmationPopup(style)}
            </div>
            <RippleMap db={this.props.db}/>
        </div>
    )
  }

    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });        
    }

    // CODE TO DEAL WITH LOCATION QUESTION POPUP  

    //this fires when the user closes the bottle popup - unfortunately can't run this when they click send
    closeConfirmation = () => {
        this.setState({
            confirmationOpen: false
        });
    }

    openConfirmation = (e) => {
        e.preventDefault();
        this.setState({confirmationOpen: true});
    }

    openModal = () => {
        this.setState({ open: true });
    }

    closeModal = () => {
        this.setState({ open: false });
    }

    closeModalandOpenConfirmation = () => {
        this.setState({
            confirmationOpen: true,
            open: false
        }, () => this.sendLocationToDB());
    }

    sendLocation = (e) => {
        const { city, email } = this.state;
        let errors = this.validateUser(city, email);
        if (errors.city || errors.email) {
            return this.setState({
                errors: errors
            });
        }
        e.preventDefault()
        if (this.state.email.length > 0) {
            this.closeModalandOpenConfirmation();
        }
        return;
    }

    validateUser = (city, email) => {
        // true means invalid, so our conditions got reversed
        return {
          city: city.geometry === undefined,   
          email: !(EmailValidator.validate(email))
        };
    }

    sendLocationToDB = () => {
        var name = this.state.name;
        if (name === "")  {
            name = "anonymous"
        }
        let now = moment().format('MMMM Do YYYY, h:mm:ss a');
        let db = fire.firestore();
        let that = this;
        if (localStorage.getItem('fingerprint') === null) {
            db.collection(this.props.db).doc('rippleMap').collection('rippleMap').add({
                lat: this.state.city.geometry.location.lat(this.state.city),
                lng: this.state.city.geometry.location.lng(this.state.city),
                name: name,
                email: this.state.email,
                timeSent: now
            })
            .then(function() {
                that.setState({
                    inDatabase: true,
                    errors: undefined
                },
                 () => ReactGA.event({
                    category: 'User',
                    action: 'Create Location without Fingerprint'
                  }));
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection(this.props.db).doc('rippleMap').collection('rippleMap').doc(this.state.fingerprint).set({
                lat: this.state.city.geometry.location.lat(this.state.city),
                lng: this.state.city.geometry.location.lng(this.state.city),
                name: name,
                email: this.state.email,
                timeSent: now
            })
            .then(function() {
                that.setState({
                    inDatabase: true,
                    errors: undefined
                }, () => ReactGA.event({
                    category: 'User',
                    action: 'Create Location with Fingerprint'
                  }));
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }

    componentDidMount = () => {
        this.props.isLoaded();
        let db = fire.firestore();
        const mapsRef = db.collection(this.props.db).doc('rippleMap').collection('rippleMap').doc(localStorage.getItem("fingerprint"))
        mapsRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            mapsRef.onSnapshot((doc) => {
              this.setState({
                inDatabase: true,
                name: doc.data().name,
                email: doc.data().email
              });
            });
          }
          else {
            this.setState({
                inDatabase: false    
              });
          }
      });
    }

    locationInputPopup = (style) => {
        let autocompleteStyle = {
            addingLeft: '12px',
            padding: '1em 0',
            boxSizing: 'border-box !important',
            height: '20px',
            color: 'var(--grey-20)',
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '1em',
            lineHeight: '1em',
            width: '100%',
            background: "transparent", 
            border: '1px solid #e9ebec'
        }

        return <Popup open={this.state.open} closeOnDocumentClick onClose={this.closeModal} contentStyle={style}>
            <div className="popup">
                <div>
                    <h2>And where are you from?</h2>
                    <h4>City:</h4>
                    <Autocomplete style={autocompleteStyle} onPlaceSelected={(place) => {
                        this.setState({ city: place });
                    } } />
                    {this.state.errors !== undefined && this.state.errors.city === true ?
                        <small className="small-red">Please add a city before submitting.</small>
                        :
                        null}
                    <h4>Name:</h4>
                    <input type="text" style={{ height: '20px' }} className="popup__input popup__input__sm" required minLength="4" siz="10" name="name" value={this.state.name} placeholder={"Please add your name."} onChange={e => { this.handleChange(e); } } />
                    <h4>Email:</h4>
                    <input type="email" style={{ height: '20px' }} className={this.state.errors !== undefined && this.state.errors.email === true ? "popup__input popup__input--sm-invalid" : "popup__input popup__input--sm"} minLength="4" siz="10" name="email" value={this.state.email} placeholder={"Please add your email."} onChange={e => { this.handleChange(e); } } />
                    {this.state.errors !== undefined && this.state.errors.email === true ?
                        <small className="small-red">Please enter a valid email before submitting.</small>
                        :
                        null}
                    <div className="popup__btn-group">
                        <button className="btn btn-full btn--cancel" onClick={this.closeModal}>Cancel</button>
                        <button className="btn btn-full btn--primary" onClick={e => this.sendLocation(e)}>Submit</button>
                    </div>
                </div>
            </div>
        </Popup>;
    }

    addLocationButton() {
        return this.state.inDatabase !== null ?
            <h6><button onClick={() => this.openModal()} className="btn q-btn" style={{margin: '0' }}> {this.state.inDatabase === true ? "Change Your City" : "Ripple"}</button></h6>
            :
            null;
    }

    locationConfirmationPopup(style) {
        return <Popup open={this.state.confirmationOpen} closeOnDocumentClick onClose={this.closeConfirmation} contentStyle={style}>
            <div className="popup">
                <div className="popup__response">
                    <img src={bottle} className="bottle" alt="Bottle" />
                    <p className="confirmation-text">Thank you for telling us more about yourself! Check this page later to see the Ripple Effect!</p>
                    <button className="btn btn--primary" style={{ width: '100%', borderRadius: '24px' }} onClick={this.closeConfirmation}>Ok</button>
                </div>
            </div>
        </Popup>;
    }
}
  
export default BrainFood;