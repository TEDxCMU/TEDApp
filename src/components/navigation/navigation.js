import React, { Component } from 'react';
import '../../App.css';
import { NavLink } from 'react-router-dom';
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
        return (
            <div id="navigation">
            <header>
                <img src={logo} className="logo" alt="TEDxCMU"></img>
                <Menu className="bm-menu" right 
                    isOpen={this.state.menuOpen}
                    onStateChange={(state) => this.handleStateChange(state)}>
                    <div className="nav">
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/" exact activeStyle={{color: '#6EEBFC'}}>
                            Home
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/speakers" exact activeStyle={{color:'#6EEBFC'}}>
                            Speakers
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/schedule" exact activeStyle={{color:'#6EEBFC'}}>
                            Manager Dash
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/faq" exact activeStyle={{color:'#6EEBFC'}}>
                            FAQs
                        </NavLink>
                        <NavLink onClick={() => this.closeMenu()} className="menu-item" to="/styleguide" exact activeStyle={{color:'#6EEBFC'}}>
                            Style Guide
                        </NavLink>
                        <NavLink to="/login" exact activeStyle={{color:'#6EEBFC'}}>
                            Log In
                        </NavLink>
                    </div>
                    {/* {this.props.user ?
                        <div>
                        <div className='user-profile'>
                            <img src={this.props.user.photoURL} alt=""/>
                        </div>
                        <button className="full-width button-primary" onClick={this.props.logout}>Log Out</button> 
                        </div>
                        :
                        <button className="full-width button-primary" onClick={this.props.login}>Log In</button>
                    } */}
                </Menu>
            </header>
            </div>
        );        
    }
};

export default Navigation;