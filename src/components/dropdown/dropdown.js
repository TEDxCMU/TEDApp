import React, { Component } from 'react';
import '../../App.css';
import './dropdown.css';
import check from '../../check.svg'

export class Dropdown extends Component {
  state = {
    showContent: false
  }

  toggleShow = () => {
    const doesShow = this.state.showContent;
    this.setState({
      showContent: !doesShow
    });
  };

    render() {
      let content = null;
      if (this.state.showContent ) {
        content = (
          <div className="content">
            {this.props.children}
          </div>
        );
      }
      
      return (
        <div className="dropdown">
            <div onClick={this.toggleShow} className="label">
                <h6 className={this.state.showContent ? "question-title-open" : "question-title"}>{this.props.question}</h6>
                {this.props.check ? 
                  <img className="check" src={check} alt="check"></img>
                :
                  <div></div>
                }
                <h4 className="question-plus">{this.state.showContent ? "-" : "+"}</h4>
            </div>
            {content}
        </div>
      );
    }

    componentWillReceiveProps = (props) => {
      if (this.props.answered) {
        this.setState({
          showContent: false
        })
      }
    }

}

export default Dropdown;