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
          burgerColor: '#fff'
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
                background: this.state.burgerColor,
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
                                    <li><NavLink onClick={() => this.closeMenu()} to="/qanda" exact activeStyle={{color:'#6EEBFC'}}>
                                        Q &amp; A
                                    </NavLink></li>
                                    <li><NavLink onClick={() => this.closeMenu()} to="/ripple" exact activeStyle={{color:'#6EEBFC'}}>
                                        Ripple
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

      componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll);
    }
  
    handleScroll = () => {
        let scrollTop = window.scrollY;
        if (window.location.pathname === "/") {
          return
        }
        else if (scrollTop > 225 && this.state.burgerColor !== "red") {
          this.setState({burgerColor: "red",
                        scroll: window.scrollY})
        }
        else if (scrollTop < 225 && this.state.burgerColor !== "#fff") {
          this.setState({burgerColor: "#fff",
                        scroll: window.scrollY})
        }
  
    }
    
    componentDidMount = () => {
      window.addEventListener('scroll', this.handleScroll);
    }

};

export default Navigation;