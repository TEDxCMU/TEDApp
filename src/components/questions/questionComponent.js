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
    console.log(this.state)
    let question = this.props.question;
    let index = this.props.index;
    let id = this.props.id;
    return (
        <div className="speakers">
            <Dropdown title={question}>
                <form align='center'>
                    <label align='center'>Answer Question</label>
                    <input type="text" name="answer" value={this.state.answer} onChange={this.handleChange}/>
                    {this.props.answered === true ? 
                    <div>
                        <button type="button" className="button-sent">Answered</button>
                    </div>     
                    :
                        <button type="button" className="button-primary" onClick={() => this.props.answerQuestion(id, this.state.answer, index)}>Answer Question</button> 
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
    //   const db = fire.firestore();
    //   db.settings({
    //     timestampsInSnapshots: true
    //   });
    //   var wholeData = [];
    //   let speakerID = "wLs9MTPHfZk5AbebslaQ"
    //   db.collection('speakers').doc(speakerID).collection("questions").get()
    //   .then(snapshot => {
    //       snapshot.forEach(doc => {
    //           let docCopy = doc.data();
    //           wholeData.push(docCopy)
    //       });
    //       // let questions = Array(wholeData.length)
    //     this.setState(
    //         {questions: wholeData
    //       }, () => console.log(this.state.questions))
    //   })
    }
      
}
export default QuestionComponent;