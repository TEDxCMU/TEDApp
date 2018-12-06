import React, { Component } from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';
import logo from '../logo.png';
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
        return (
            <div id="navigation">
            <header>
                <img src={logo} className="logo" alt="TEDxCMU"></img>
                <Menu className="bm-menu" right 
                    isOpen={this.state.menuOpen}
                    onStateChange={(state) => this.handleStateChange(state)}>
                    <div className="nav">
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/" exact activeStyle={{color:'#e62b1e'}}>
                            Home
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/speakers" exact activeStyle={{color:'#e62b1e'}}>
                            Speakers
                        </NavLink>
                        <div>
                            {this.state.type !== null && this.state.type === 2 ?
                                <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/questions" exact activeStyle={{color:'#e62b1e'}}>
                                    My Questions
                                </NavLink>
                            :
                                <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/questions" exact activeStyle={{color:'#e62b1e'}}>
                                    My Questions
                                </NavLink>
                                
                            }
                        </div>

                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/schedule" exact activeStyle={{color:'#e62b1e'}}>
                            Manager Dash
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/faq" exact activeStyle={{color:'#e62b1e'}}>
                            FAQs
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/styleguide" exact activeStyle={{color:'#e62b1e'}}>
                            Style Guide
                        </NavLink>
                        <NavLink to="/login" exact activeStyle={{color:'#e62b1e'}}>
                            Log In
                        </NavLink>
                    </div>
                    {this.props.user ?
                        <div>
                        <div className='user-profile'>
                            <img src={this.props.user.photoURL} alt=""/>
                        </div>
                        <button className="full-width button-primary" onClick={this.props.logout}>Log Out</button> 
                        </div>
                        :
                        <button className="full-width button-primary" onClick={this.props.login}>Log In</button>
                    }
                </Menu>
                <button onClick={this.componentDidMount}>REMOUNT BITCHES</button>
            </header>
            </div>
        );        
    }

    componentDidMount = () => {
        console.log("navigation is mounted")
        console.log(this.state)
        console.log(this.props.user)
        let savedUser = this.props.user;
        console.log(savedUser)
        if (savedUser !== null) {
            console.log(savedUser.type)
            this.setState({
                type: savedUser.type
            })
        }
    }
};

export default Navigation;