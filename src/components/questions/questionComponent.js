import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../../App.css';
import './myQuestions.css';
import Dropdown from '../dropdown/dropdown';

export class QuestionComponent extends Component {
    constructor() {
      super();
      this.state = {
      }
    }

    
    render() {
    let question = this.props.question;
    let name = this.props.name;
    return (
        <div className="speaker">
            <Dropdown question={question} open={this.state.open} answered={this.props.answered} check={this.props.answerInDB}>
                <form className="questions-form">
                    <label style={{marginTop: '0'}}>Question:</label>
                    <p>"{question}"</p>
                    <p>FROM: {name}</p>
                    <textarea className="popup-input" type="text" name="answer" value={this.state.answer} onChange={this.handleChange}/>
                    {this.props.answered === true ? 
                    <div>
                        <button type="button" className="button-sent full-width">Answered</button>
                    </div>     
                    :
                        <button type="button" style={{marginTop: '2rem', marginBottom: '10px'}} className="button-primary full-width" onClick={(e) => this.closeAndSend(e)}>{this.props.answerInDB ? "Re-Submit" : "Answer"}</button> 
                    }           
                </form>
            </Dropdown>
        </div>
    );
  }

    handleChange = (e) => {
      this.setState({ [e.target.name] : e.target.value });
    }

    componentDidMount = () => {
        this.setState({
            answer: this.props.answer
        })
    }

    componentWillReceiveProps = () => {
        if (this.props.answered) {
            this.setState({
                open: false
            })
        }
    }

    closeAndSend = (e) => {
        e.preventDefault();
        let { index, id } = this.props;
        this.props.answerQuestion(id, this.state.answer, index);
    }
}
export default QuestionComponent;