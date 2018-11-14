import React, { Component } from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';
import logo from '../logo.png';
import './navigation.css';

export class Navigation extends Component {
    render() {
        return (
            <div>
                <header>
                    <img src={logo} className="" alt="TEDxCMU"></img>
                    <div className="nav">
                        <NavLink to="/" exact activeStyle={{color:'#e62b1e'}}>
                            Home
                        </NavLink>
                        <NavLink to="/schedule" exact activeStyle={{color:'#e62b1e'}}>
                            Manager Dash
                        </NavLink>
                        <NavLink to="/faq" exact activeStyle={{color:'#e62b1e'}}>
                            FAQ
                        </NavLink>
                        <NavLink to="/styleguide" exact activeStyle={{color:'#e62b1e'}}>
                            Style Guide
                        </NavLink>
                    </div>
                    {this.props.user ?
                        <div>
                        <div className='user-profile'>
                            <img src={this.props.user.photoURL} alt=""/>
                        </div>
                        <button className="medium button-primary" onClick={this.props.logout}>Log Out</button> 
                        </div>
                        :
                        <button className="medium button-primary" onClick={this.props.login}>Log In</button>
                    }
                </header>
            </div>
        );        
    }
};

export default Navigation;