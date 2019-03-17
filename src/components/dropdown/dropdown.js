import React, { Component } from 'react';
import '../../App.css';
import './dropdown.css';

export class Dropdown extends Component {
  state = {
    showContent: false
  }

  toggleShow = () => {
    const doesShow = this.state.showContent;
    if (this.state.className === "closed") {
      this.setState(
        { showContent: !doesShow
        }
      );
    }
    else {
      this.setState(
        { showContent: !doesShow
        }
      );
    }

  };

    render() {

      let content = null;
      if (this.state.showContent) {
        content = (
          <div className="content">
            {this.props.children}
          </div>
        );
      }
      
      return (
        <div className="dropdown">
            <div onClick={this.toggleShow} className="label">
                <h6 className="question-title">{this.props.question}</h6>
                { this.state.showContent ===  false ?
                <h4 className="question-plus">+</h4>
                :
                <h4 className="question-plus">–</h4>
                }
            </div>
            {content}
        </div>
      );
    }
}

export default Dropdown;