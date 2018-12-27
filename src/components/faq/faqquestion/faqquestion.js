import React, { Component } from 'react';
import '../../../App.css';
import './faqquestion.css';

export class FaqQuestion extends Component {
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
        <div className="faqquestion">
            <div onClick={this.toggleShow} className="label">
                <span className="question-title"><h6>{this.props.question}</h6></span>
                <span className="question-plus"><h4 className="plus">+</h4></span>
            </div>
            <p>{content}</p>
        </div>
        );
      }
  }

  export default FaqQuestion;