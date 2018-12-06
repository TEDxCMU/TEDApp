import React, { Component } from 'react';
import 'rc-time-picker/assets/index.css';
import '../App.css';
import './speakers.css';
import fire from '../fire.js';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';

export class MyQuestions extends Component {
    constructor() {
      super();
      this.state = {
        allSpeakers: [],
        questions: new Array(9),
      }
    }

    render() {
        return (
          <div>
            <TimePicker
            />
          </div>
        );
      }
      
}
export default MyQuestions;