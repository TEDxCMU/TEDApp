import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../../App.css';
import '../speakers/speakers.css';
import fire from '../../fire.js';
import Dropdown from '../dropdown/dropdown';

export class QuestionComponent extends Component {
    constructor() {
      super();
      this.state = {
      }
    }

    
    render() {
    let question = this.props.question;
    let index = this.props.index;
    let id = this.props.id;
    let name = this.props.name;
    console.log(this.props.name)
    return (
        <div className="speaker">
            <Dropdown title={name}>
                <form align='center'>
                    <label align='center'>Question: {question}</label>    
                    <input type="text" name="answer" value={this.state.answer} onChange={this.handleChange}/>
                    {this.props.answered === true ? 
                    <div>
                        <button type="button" className="button-sent">Answered</button>
                    </div>     
                    :
                        <button type="button" className="button-primary" style={{marginTop: "5px"}} onClick={() => this.props.answerQuestion(id, this.state.answer, index)}>Answer Question</button> 
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
      
}
export default QuestionComponent;