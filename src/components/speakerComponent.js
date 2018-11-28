import React, { Component } from 'react';
import '../App.css';
import './speakers.css';
import Dropdown from './dropdown';
import fire from '../fire.js';
import moment from 'moment';

export class SpeakerComponent extends Component {
    constructor() {
      super();
      this.state = {
        allEvents: [],
      }
    }

    render() {
        let id = this.props.id;
        let question = this.props.question;
        let index = this.props.index;
      return (
        <div className="speakers">
            <Dropdown title={this.props.name}>
                Hey there friend whats poppin
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                    <br /> 
                </div>
                <form align='center'>
                    <label align='center'>Ask Question</label>
                    <input type="text" name={index} value={question} onChange={this.props.handleChange}/>
                    <button type="button" className="button-primary" onClick={() => this.props.logState()}>Log state</button>
                    <button type="button" className="button-primary" onClick={() => this.props.createQuestion({id}, {question})}>Send</button>
                </form>
            </Dropdown>
        </div>
      );
    }
  }
  
export default SpeakerComponent;