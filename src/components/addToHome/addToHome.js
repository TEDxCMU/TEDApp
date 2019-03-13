import React, { Component } from 'react';
import '../../App.css';
import './addToHome.css';
import './downloadIcon.png';

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
            <div className={closed ? 'closed' : ''} style={{width: "100%"}}>
                { this.props.iOS && this.props.loaded ? 
                    <div id="popup-bg">
                        <div id="popup-content">
                            <div className="closeModal" onClick={(e) => {this.closeModal(e)}}>X</div>
                            {/* <img src={require('./plusIcon.png')} className="plus" alt="add" title="add" /> */}
                            <p><strong>Install TEDxCMU</strong> for quick and easy access when you're on the go</p>
                            <p>Just tap <img src={require('./downloadIcon.png')} className="download-icon" alt="download icon" title="download icon" /> and then "Add to Homescreen"</p>
                            {/* <button className="blank" style={{marginBottom: '5px'}} type="button" onClick={(e) => this.closeModal()}>No thanks</button> */}
                        </div>
                    </div>
                :
                <div></div>
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