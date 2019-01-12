import React, { Component } from 'react';
import '../../App.css';
import './addToHome.css';
import './downloadIcon.png'

export class PopUp extends Component {
    constructor(props) {
        super();
        this.state = {
        }
    }
      
    render() {
        return (
            <div style={{width: "100%"}}>
                { this.props.iOS ? 
                    <div id="popup-bg">
                        <div id="popup-content">
                            {/* <img src={require('./plusIcon.png')} className="plus" alt="add" title="add" /> */}
                            <h5>HEY!</h5>
                            <p>Install this web app on your iPhone! Tap <img src={require('./downloadIcon.png')} className="download-icon" alt="download icon" title="download icon" /> and then "Add to Homescreen"</p>
                            <button type="button" onClick={(e) => this.closeModal()}>No thanks</button>
                        </div>
                    </div>
                :
                <div id="popup">
                        <h5>Tap below to add an icon to your Android home screen for quick access!</h5>
                        <button type="button" onClick={(e) => this.closeModal()}>No thanks</button>
                </div>
                }
            </div>
        );
    }

    closeModal = (e) => {
        localStorage.setItem("popup", false)
        window.location.reload()
    }
}

export default PopUp;