import React, { Component } from 'react';
import '../../App.css';
import { auth, provider } from '../../fire.js';
import {NavLink} from 'react-router-dom';
import logo from '../../logo.png';
import './navigation.css';
import { slide as Menu } from 'react-burger-menu';

export class Navigation extends Component {
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
        console.log(this.props.user)
        return (
            <div id="navigation">
            <header>
                <img src={logo} className="logo" alt="TEDxCMU"></img>
                <Menu className="bm-menu" right 
                    isOpen={this.state.menuOpen}
                    onStateChange={(state) => this.handleStateChange(state)}>
                    <div className="nav">
                        <ul>
                        <li><NavLink onClick={() => this.closeMenu()} className="menu-item" to="/" exact activeStyle={{color:'#e62b1e'}}>
                            Home
                        </NavLink></li>
                        <div>
                            {this.props.user !== null && localStorage.getItem("userEmail") !== "dijour@cmu.edu" ?
                                <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/questions" exact activeStyle={{color:'#e62b1e'}}>
                                    My Questions
                                </NavLink>
                            :
                                <div></div>
                                
                            }
                        </div>
                        <li><NavLink onClick={() => this.closeMenu()} className="menu-item" to="/faq" exact activeStyle={{color:'#e62b1e'}}>
                            FAQs
                        </NavLink></li>
                        <li><NavLink onClick={() => this.closeMenu()} className="menu-item" to="/styleguide" exact activeStyle={{color:'#e62b1e'}}>
                            Style Guide
                        </NavLink></li>
                        </ul>
                    </div>
                    {this.props.user === null ?
                        <div></div>
                        :
                        <div>
                        <div className='user-profile'>
                            <img src={this.props.user.photoURL} alt=""/>
                        </div>
                        <button className="full-width button-primary" onClick={this.props.logout}>Log Out</button> 
                        </div>
                    }
                    
                </Menu>
            </header>
            </div>
        );        
    }

    logout() {
        auth.signOut()
          .then(() => {
          });
      }

    componentDidMount = () => {
        console.log("navigation is mounted")
    }
};

export default Navigation;