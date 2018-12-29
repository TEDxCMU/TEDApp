import React, { Component } from 'react';
import '../../App.css';
import HeaderBG from '../../header-bg.svg';
import logo from '../../logo.png';
import {Link} from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
// import headerBG from '../../header-bg.svg';
import './header.css';
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
                        <div className="speakerHeader">
                            { this.props.image !== undefined ?
                                <div>
                                    <img className="image" src={this.props.image}></img>
                                </div>
                            :
                                <div></div>
                            }
                            <br />
                            <h1 className="titleSpeaker">{this.props.title}</h1>
                            { this.props.tag !== undefined ?
                                <div>
                                    <h4 className="description">{this.props.tag}</h4>
                                </div>
                            :
                                <div></div>
                            }
                        </div>
                        :
                        <div>
                            <h1 className="title">{this.props.title}</h1>
                            <h6 className="description">{this.props.description}</h6>
                        </div>
                    }
                    
                </div>
            </header>
        );        
    }
};

export default Header;