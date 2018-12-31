import React, { Component } from 'react';
import '../../App.css';
import HeaderBG from '../../header-bg.svg';
import logo from '../../logo.png';
import {Link} from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
import './header.css';
import { SocialIcon } from 'react-social-icons';
// import { slide as Menu } from 'react-burger-menu';
// import { Navigation } from '../navigation/navigation';

export class Header extends Component {
    constructor (props) {
        super(props)
        this.state = {
          menuOpen: false
        }
    }

    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})  
      }

    closeMenu () {
        this.setState({menuOpen: false})
      }

    toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
    }

    render() {
        return (
            <header className="sticky">
                <Link key={'home'} to={{
                    pathname: '/',
                    state: {  
                    }
                }}>
                    <img src={logo} className="logo" alt="TEDxCMU"></img>
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
                                    <SocialIcon network="twitter" url={this.props.twitter} fgColor="#ffffff" bgColor="rgba(0,0,0,0)" />
                                </div>
                            :
                                <div></div>
                            }
                            <div className="question-btn-container">
                                <h6><a shref="" className="question-btn">AskQuestion</a></h6>
                            </div>
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