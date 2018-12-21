import React, { Component } from 'react';
import '../../App.css';
import { NavLink } from 'react-router-dom';
import logo from '../../logo.png';
import './header.css';
import { slide as Menu } from 'react-burger-menu';
import { Navigation } from '../navigation/navigation';

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
            <header className="header-content">
                <h1 className="title">{this.props.title}</h1>
                <h6 classname="description">{this.props.description}</h6>
            </header>
        );        
    }
};

export default Header;