import React, { Component } from 'react';
import '../../App.css';
import './dropdown.css';

export class Dropdown extends Component {
  state = {
    showContent: false
  }

  toggleShow = () => {
    const doesShow = this.state.showContent;
    this.setState({ showContent: !doesShow});
  };

    render() {

      let content = null;
      if (this.state.showContent) {
        content = (
          <div className="content">
            <p>{this.props.children}</p>
          </div>
        );
      }
      
      return (
        <div className="dropdown">
          <div onClick={this.toggleShow} className="label"><span><h4>{this.props.title}</h4></span><h4><span>+</span></h4></div>
          {content}
        </div>
      );
    }
}

export default Dropdown;