import React, { Component } from 'react';
import '../../App.css';
import './addToHome.css';
import downloadIcon from './downloadIcon.png';

export class PopUp extends Component {
    constructor(props) {
        super();
        this.state = {
            closed: false
        }
    }
    
    render() {
        const closed = this.state.closed;
        
        return (
            <div className={closed ? 'home-popup__closed' : ''}>
                { this.props.iOS && this.props.loaded ? 
                    <div className="home-popup">
                        <div className="home-popup__close" onClick={(e) => {this.closeModal(e)}}>X</div>
                        <div className="home-popup__content">
                            <p><strong>Install TEDxCMU</strong> for quick and easy access when you're on the go.</p>
                            <p>Tap <img src={downloadIcon} className="i-download" alt="download icon" title="download icon" /> and then "Add to Homescreen."</p>
                        </div>
                    </div>
                :
                null
                }
            </div>
        );
    }

    reloadPage = () => {
        window.location.reload();
    }

    closeModal = (e) => {
        this.setState({
            closed: true
        });
        e.preventDefault();
        localStorage.setItem("popup", false);
        setTimeout(this.reloadPage, 500);
    }
}

export default PopUp;