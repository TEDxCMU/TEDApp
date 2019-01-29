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
                <h6 className="question-title">{this.props.question}</h6>
                <h4 className="question-plus">+</h4>
            </div>
            {content}
        </div>
        );
      }
  }

  export default FaqQuestion;