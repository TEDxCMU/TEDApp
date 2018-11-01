import React, { Component } from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';

export class Navigation extends Component {
    render() {
        return (
            <div>
                <header>
                <h1>TEDxCMU App</h1>
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
                    </div>
                    {this.props.user ?
                        <div>
                        <div className='user-profile'>
                            <img src={this.props.user.photoURL} alt=""/>
                        </div>
                        <button onClick={this.props.logout}>Log Out</button> 
                        </div>
                        :
                        <button onClick={this.props.login}>Log In</button>
                    }
                </header>
<<<<<<< HEAD
=======

                <div style={{display: 'flex', justifyContent: 'space-around'}} >
                    <NavLink to="/" exact activeStyle={{color:'green'}}>
                        Home
                    </NavLink>
                    <NavLink to="/schedule" exact activeStyle={{color:'green'}}>
                        Schedule
                    </NavLink>
                </div>
>>>>>>> 36afb81e3878459c3d64d04631ad0405a676f9ad
            </div>
        );        
    }
};

export default Navigation;