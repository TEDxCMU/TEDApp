import React, { Component } from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';

export class Navigation extends Component {
    render () {
        return (
            <div>
                <header>
                <h1>Project Hi</h1>
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

                <div style={{display: 'flex', justifyContent: 'space-around'}} >
                    <NavLink to="/" exact activeStyle={{color:'green'}}>
                        Home
                    </NavLink>
                    <NavLink to="/schedule" exact activeStyle={{color:'green'}}>
                        Schedule
                    </NavLink>
                </div>
            </div>
        );        
    }
};

export default Navigation;