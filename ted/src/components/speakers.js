import React, { Component } from 'react';
import '../App.css';
import './speakers.css';
import Dropdown from './dropdown';

export class Speakers extends Component {
    constructor() {
      super();
      this.state = {
        allEvents: []
      }
    }

    render() {
      return (
        <div className="speakers">
            <Dropdown title="Dawn Wacek">
                Hey there friend whats poppin
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
            </Dropdown>
            <Dropdown title="Freddy White">
                Hi a wonderful world...
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
            </Dropdown>
            <Dropdown title="Mary Short">
                Hi a wonderful world...
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
            </Dropdown>
        </div>
        
      );
    }
  }
  
export default Speakers;