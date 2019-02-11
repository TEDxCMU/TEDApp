import React, { Component } from 'react';
import '../../App.css';
import { auth } from '../../fire.js';
import {NavLink} from 'react-router-dom';
import './navigation.css';
import { slide as Menu } from 'react-burger-menu';

export class Navigation extends Component {
    constructor (props) {
        super(props)
        this.state = {
          menuOpen: false,
          burgerBarColor: '#e62b1e'
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
        var burgerBarStyle = {
            bmBurgerBars: {
                background: this.props.burgerColor,
                transition: 'background 1s ease-in-out'
            }
        };
        return (
            // Would be dope to change the color of the burger bars based on props passed in from App.js scrolling
            <div>
                {this.props.loaded ? 
                    <div id="navigation">
                        <Menu noOverlay right 
                            isOpen={this.state.menuOpen}
                            onStateChange={(state) => this.handleStateChange(state)}
                            styles={burgerBarStyle}>
                            <div className="nav">
                                <ul>
                                    <li><NavLink onClick={() => this.closeMenu()} to="/" exact activeStyle={{color:'#6EEBFC'}}>
                                        Home
                                    </NavLink></li>
                                    <div>
                                        {this.props.user !== null && localStorage.getItem("userEmail") !== "dijour@cmu.edu" ?
                                            <NavLink onClick={() => this.closeMenu()} to="/questions" exact activeStyle={{color:'#6EEBFC'}}>
                                                My Questions
                                            </NavLink>
                                        :
                                            <div></div>
                                            
                                        }
                                    </div>
                                    <li><NavLink onClick={() => this.closeMenu()} to="/faq" exact activeStyle={{color:'#6EEBFC'}}>
                                        FAQs
                                    </NavLink></li>
                                    <li><NavLink onClick={() => this.closeMenu()} to="/map" exact activeStyle={{color:'#6EEBFC'}}>
                                        Map
                                    </NavLink></li>
                                    <li><NavLink onClick={() => this.closeMenu()} to="/brainFood" exact activeStyle={{color:'#6EEBFC'}}>
                                        Brain Food
                                    </NavLink></li>
                                    {this.props.user === null ?
                                        <div></div>
                                        :
                                        <div>
                                            <li>
                                                <button className="full-width button-primary" onClick={this.props.logout}>Log Out</button> 
                                            </li>
                                        </div>
                                    }
                                </ul>
                            </div>
                        </Menu>
                    </div>
                :
                    <div></div>
                }
            </div>
        );        
    }

    logout() {
        auth.signOut()
          .then(() => {
          });
      }

};

export default Navigation;