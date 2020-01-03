import React, { Component } from 'react';
import '../../App.scss';
import styles from './addToHome.module.scss';
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
            <div className={closed ? styles['home-popup--inactive'] : ''}>
                { this.props.iOS && this.props.loaded ? 
                    <div className={styles['home-popup']}>
                        <div className={styles['home-popup--active']} onClick={(e) => {this.closeModal(e)}}>X</div>
                        <div className={styles['home-popup__content']}>
                            <p><strong>Install TEDxCMU</strong> for quick and easy access when you're on the go.</p>
                            <p>Tap <img src={downloadIcon} className={styles['i-download']} alt="download icon" title="download icon" /> and then "Add to Homescreen."</p>
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