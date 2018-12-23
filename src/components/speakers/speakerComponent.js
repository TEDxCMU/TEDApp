import React, { Component } from 'react';
import '../../App.css';
import './speakers.css';
import Dropdown from '../dropdown/dropdown';

export class SpeakerComponent extends Component {

    render() {
        let email = this.props.email;
        let question = this.props.question;
      return (
        <div className="speakers">
            <Dropdown title={this.props.name}>
                Hey there friend whats poppin
                <div className="video">
                    <iframe title={this.props.name + "'s Related TED Talks"} src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                    <br /> 
                </div>
                <form align='center'>
                    <label align='center'>Ask Question</label>
                    <input type="text" name="question" value={question} onChange={this.props.handleChange}/>
                    {this.props.asked === true ? 
                    <div>
                        <button type="button" className="button-sent">Sent</button>
                    </div>     
                    :
                    <div>
                        <button type="button" className="button-primary" onClick={() => this.props.createQuestion({email}, {question})}>Send</button>
                    </div>     
                    }           
                </form>
            </Dropdown>
        </div>
      );
    }
  }
  
export default SpeakerComponent;