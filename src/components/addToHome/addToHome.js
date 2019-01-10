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
        console.log("THE IOS IS: ", this.props.iOS)
        return (
            <div style={{width: "100%"}}>
                { this.props.iOS ? 
                    <div id="popup">
                        <img src={require('./plusIcon.png')} className="plus" alt="MyImage" title="MyImage" />
                        <div>
                            <span>Install this web app on your iPhone: Tap </span>
                            <img src={require('./downloadIcon.png')} className="tiny" alt="MyImage" title="MyImage" />
                            <span> and then "Add to Homescreen"</span>
                        </div>
                        <button type="button" onClick={(e) => this.closeModal()}>No, thanks</button>

                    </div>
                :
                <div id="popup">
                        <h5>Tap below to add an icon to your Android home screen for quick access!</h5>
                        <button type="button" onClick={(e) => this.closeModal()}>No, thanks</button>
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